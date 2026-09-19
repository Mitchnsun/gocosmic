import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ContactPayload } from '@/lib/contact/validation';
import { emptyContactPayload } from '@/lib/contact/validation';

const ENDPOINT = 'https://www.gocosmic.dev/api/contact';

const validBody = (overrides: Partial<ContactPayload> = {}) => ({
  ...emptyContactPayload(),
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like a showcase website for my analytical engine.',
  ...overrides,
});

const buildRequest = (body: unknown, headers: Record<string, string> = {}) =>
  new Request(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

/** Fresh module instance so the in-memory rate limiter starts empty. */
const loadRoute = async () => {
  vi.resetModules();
  return import('@/app/api/contact/route');
};

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.spyOn(console, 'info').mockImplementation(() => {});
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_FROM_EMAIL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('accepts a valid submission', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody(), { 'x-forwarded-for': '1.1.1.1' }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
  });

  it('refuses to acknowledge the message when no provider is configured in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody(), { 'x-forwarded-for': '9.9.9.9' }));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: 'delivery_failed' });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('logs the whole submission outside production so nothing is lost', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody(), { 'x-forwarded-for': '8.8.8.8' }));

    expect(response.status).toBe(200);
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('no mail provider configured'),
      expect.objectContaining({ message: 'I would like a showcase website for my analytical engine.' })
    );
  });

  it('rejects a cross-origin submission', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody(), { origin: 'https://evil.example' }));

    expect(response.status).toBe(403);
  });

  it('accepts a same-origin submission', async () => {
    const { POST } = await loadRoute();

    const response = await POST(
      buildRequest(validBody(), { origin: 'https://www.gocosmic.dev', 'x-real-ip': '2.2.2.2' })
    );

    expect(response.status).toBe(200);
  });

  it('rejects a malformed origin', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody(), { origin: 'not-a-url' }));

    expect(response.status).toBe(403);
  });

  it('rejects an oversized body even when content-length lies about it', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody({ message: 'a'.repeat(30_000) }), { 'content-length': '10' }));

    expect(response.status).toBe(413);
  });

  it('rejects invalid JSON', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest('{ not json', {}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'invalid_json' });
  });

  it('reports the invalid fields', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest({ name: 'A', email: 'nope', message: 'short' }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'validation',
      fields: { name: 'name_length', email: 'email_invalid', message: 'message_length' },
    });
  });

  it('ignores non-string fields', async () => {
    const { POST } = await loadRoute();

    const response = await POST(buildRequest({ name: 42, email: null, message: [] }));

    expect(response.status).toBe(400);
  });

  it('silently accepts a submission that filled the honeypot', async () => {
    const { POST } = await loadRoute();
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    const response = await POST(buildRequest(validBody({ honeypot: 'bot' })));

    expect(response.status).toBe(200);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('rate limits the fourth submission from the same IP', async () => {
    const { POST } = await loadRoute();
    const headers = { 'x-forwarded-for': '3.3.3.3, 10.0.0.1' };

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const allowed = await POST(buildRequest(validBody(), headers));
      expect(allowed.status).toBe(200);
    }

    const blocked = await POST(buildRequest(validBody(), headers));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0);
  });

  it('forwards the message through the mail provider when configured', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_TO_EMAIL = 'inbox@gocosmic.dev';
    process.env.CONTACT_FROM_EMAIL = 'site@gocosmic.dev';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody({ subject: 'A showcase website' })));

    expect(response.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.resend.com/emails');
    const payload = JSON.parse(init.body);
    expect(payload).toMatchObject({
      from: 'site@gocosmic.dev',
      to: ['inbox@gocosmic.dev'],
      reply_to: 'ada@example.com',
      subject: 'A showcase website',
    });
    expect(payload.text).toContain('Ada Lovelace');
  });

  it('falls back to a generated subject', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_TO_EMAIL = 'inbox@gocosmic.dev';
    process.env.CONTACT_FROM_EMAIL = 'site@gocosmic.dev';
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    const { POST } = await loadRoute();

    await POST(buildRequest(validBody()));

    expect(JSON.parse(fetchMock.mock.calls[0]![1].body).subject).toBe('Contact — Ada Lovelace');
  });

  it('reports a provider rejection', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_TO_EMAIL = 'inbox@gocosmic.dev';
    process.env.CONTACT_FROM_EMAIL = 'site@gocosmic.dev';
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody()));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: 'delivery_failed' });
  });

  it('reports a provider outage', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.CONTACT_TO_EMAIL = 'inbox@gocosmic.dev';
    process.env.CONTACT_FROM_EMAIL = 'site@gocosmic.dev';
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const { POST } = await loadRoute();

    const response = await POST(buildRequest(validBody()));

    expect(response.status).toBe(502);
  });
});
