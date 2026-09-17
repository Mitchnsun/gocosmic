import { NextResponse } from 'next/server';

import { createRateLimiter } from '@/lib/contact/rateLimit';
import type { ContactPayload } from '@/lib/contact/validation';
import { emptyContactPayload, validateContact } from '@/lib/contact/validation';

/** Maximum submissions accepted per client IP within {@link RATE_LIMIT_WINDOW_MS}. */
const RATE_LIMIT = 3;
/** Rate-limit window: one hour. */
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
/** Rejects oversized bodies before parsing. */
const MAX_BODY_BYTES = 20_000;

const limiter = createRateLimiter({ limit: RATE_LIMIT, windowMs: RATE_LIMIT_WINDOW_MS });

/** Reads the client IP from the proxy headers, falling back to a shared bucket. */
const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return (forwarded.split(',')[0] ?? forwarded).trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
};

/** Same-origin check: custom route handlers get no CSRF protection from Next.js. */
const isSameOrigin = (request: Request): boolean => {
  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients send no Origin header
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
};

/** Coerces unknown JSON into a fully-populated string payload. */
const toPayload = (body: unknown): ContactPayload => {
  const source = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>;
  const read = (key: keyof ContactPayload) => {
    const value = source[String(key)];
    return typeof value === 'string' ? value.slice(0, 6000) : '';
  };

  return {
    ...emptyContactPayload(),
    name: read('name'),
    email: read('email'),
    subject: read('subject'),
    message: read('message'),
    phone: read('phone'),
    company: read('company'),
    honeypot: read('honeypot'),
  };
};

/** Forwards the message by email when a provider is configured. */
const deliver = async (payload: ContactPayload): Promise<boolean> => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // No provider configured (e.g. previews): accept the message and log it so
    // the submission is not silently lost.
    console.info('[contact] submission received without a configured mail provider', {
      email: payload.email.trim(),
      subject: payload.subject.trim(),
    });
    return true;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email.trim(),
      subject: payload.subject.trim() || `Contact — ${payload.name.trim()}`,
      text: [
        `Name: ${payload.name.trim()}`,
        `Email: ${payload.email.trim()}`,
        `Phone: ${payload.phone.trim() || '—'}`,
        `Company: ${payload.company.trim() || '—'}`,
        '',
        payload.message.trim(),
      ].join('\n'),
    }),
  });

  return response.ok;
};

/**
 * Handles contact form submissions: same-origin check, honeypot, schema
 * validation, per-IP rate limiting, then delivery through the configured mail
 * provider.
 */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'payload_too_large' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  const payload = toPayload(body);

  // Honeypot: silently accept so bots cannot tell they were filtered out.
  if (payload.honeypot.trim().length > 0) {
    return NextResponse.json({ success: true });
  }

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: 'validation', fields: errors }, { status: 400 });
  }

  const { allowed, retryAfterSeconds } = limiter.check(getClientIp(request));
  if (!allowed) {
    return NextResponse.json(
      { error: 'rate_limited' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  try {
    const delivered = await deliver(payload);
    if (!delivered) {
      return NextResponse.json({ error: 'delivery_failed' }, { status: 502 });
    }
  } catch {
    return NextResponse.json({ error: 'delivery_failed' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
