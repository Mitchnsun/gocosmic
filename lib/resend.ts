import { Resend } from 'resend';

import { BRAND_NAME } from '@/lib/config';

/** Inbox receiving the free mockup requests and contact form messages. */
export const STUDIO_INBOX_EMAIL = 'prospect@gocosmic.dev';

/** Sender used when `RESEND_FROM_EMAIL` is not configured. */
export const DEFAULT_SENDER_EMAIL = `${BRAND_NAME} <noreply@gocosmic.dev>`;

/**
 * Resolves the sender address, which must belong to a domain verified in the
 * Resend dashboard. Read at call time, like the API key, so a redeploy is not
 * needed to pick up a new value.
 *
 * An empty or whitespace-only variable counts as unset: a deployment that
 * copies `.env.example` and fills in only the API key leaves this one defined
 * but empty, and Resend rejects every request sent with an empty `from`.
 */
export function getSenderEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_SENDER_EMAIL;
}

let client: Resend | undefined;

/**
 * Lazily instantiates the Resend client so a missing `RESEND_API_KEY` fails at
 * call time (with an explicit message) rather than at build time.
 *
 * @throws {Error} when `RESEND_API_KEY` is not set.
 */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set: cannot send email.');
  }

  client ??= new Resend(apiKey);

  return client;
}

/** Test-only helper: drops the memoised client so a new API key can be picked up. */
export function resetResendClient(): void {
  client = undefined;
}
