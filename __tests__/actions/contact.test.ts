import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { submitContactMessage } from '@/app/actions/contact';
import type { ContactPayload } from '@/lib/contact/validation';
import { emptyContactPayload } from '@/lib/contact/validation';

const send = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  Resend: class {
    emails = { send };
  },
}));

const validPayload = (overrides: Partial<ContactPayload> = {}): ContactPayload => ({
  ...emptyContactPayload(),
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like a showcase website for my analytical engine.',
  ...overrides,
});

describe('submitContactMessage', () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ error: null });
    delete process.env.RESEND_API_KEY;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it('delivers a valid submission through Resend and reports success', async () => {
    process.env.RESEND_API_KEY = 'test-key';

    const result = await submitContactMessage(validPayload({ subject: 'A showcase website' }));

    expect(result).toEqual({ status: 'success' });
    const [payload] = send.mock.calls[0]!;
    expect(payload).toMatchObject({
      from: 'Cosmic Studio <noreply@gocosmic.dev>',
      to: ['prospect@gocosmic.dev'],
      replyTo: 'ada@example.com',
      subject: 'A showcase website',
    });
    expect(payload.text).toContain('Ada Lovelace');
  });

  it('falls back to a generated subject', async () => {
    process.env.RESEND_API_KEY = 'test-key';

    await submitContactMessage(validPayload());

    expect(send.mock.calls[0]![0].subject).toBe('Contact — Ada Lovelace');
  });

  it('reports the invalid fields without delivering anything', async () => {
    const result = await submitContactMessage({ name: 'A', email: 'nope', message: 'short' });

    expect(result).toEqual({ status: 'error' });
    expect(send).not.toHaveBeenCalled();
  });

  it('ignores non-string fields', async () => {
    const result = await submitContactMessage({ name: 42, email: null, message: [] });

    expect(result).toEqual({ status: 'error' });
    expect(send).not.toHaveBeenCalled();
  });

  it('coerces a non-object input into an empty, invalid payload', async () => {
    const result = await submitContactMessage('not an object');

    expect(result).toEqual({ status: 'error' });
    expect(send).not.toHaveBeenCalled();
  });

  it('silently accepts a submission that filled the honeypot', async () => {
    const result = await submitContactMessage(validPayload({ honeypot: 'bot' }));

    expect(result).toEqual({ status: 'success' });
    expect(send).not.toHaveBeenCalled();
  });

  it('logs the submission locally and reports success when no provider is configured', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

    const result = await submitContactMessage(validPayload());

    expect(result).toEqual({ status: 'success' });
    expect(infoSpy).toHaveBeenCalledWith(
      expect.stringContaining('no mail provider configured'),
      expect.objectContaining({ name: 'Ada Lovelace' })
    );
    expect(send).not.toHaveBeenCalled();
  });

  it('refuses in production when no provider is configured', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await submitContactMessage(validPayload());

    expect(result).toEqual({ status: 'error' });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('reports a delivery failure when the provider rejects', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    send.mockResolvedValue({ error: { message: 'rejected' } });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await submitContactMessage(validPayload());

    expect(result).toEqual({ status: 'error' });
    expect(errorSpy).toHaveBeenCalled();
  });

  it('reports a delivery failure when the provider call throws', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    send.mockRejectedValue(new Error('offline'));

    const result = await submitContactMessage(validPayload());

    expect(result).toEqual({ status: 'error' });
  });
});
