import { beforeEach, vi } from 'vitest';

import {
  DEFAULT_SENDER_EMAIL,
  getResendClient,
  getSenderEmail,
  resetResendClient,
  STUDIO_INBOX_EMAIL,
} from '@/lib/resend';

const resendConstructor = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  Resend: class {
    constructor(apiKey: string) {
      resendConstructor(apiKey);
    }
  },
}));

describe('getResendClient', () => {
  beforeEach(() => {
    resendConstructor.mockClear();
    resetResendClient();
    vi.unstubAllEnvs();
  });

  it('throws an explicit error when the API key is missing', () => {
    vi.stubEnv('RESEND_API_KEY', '');

    expect(() => getResendClient()).toThrow(/RESEND_API_KEY is not set/);
  });

  it('instantiates the client once with the configured key', () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');

    const first = getResendClient();
    const second = getResendClient();

    expect(first).toBe(second);
    expect(resendConstructor).toHaveBeenCalledTimes(1);
    expect(resendConstructor).toHaveBeenCalledWith('test-key');
  });

  it('targets the studio inbox', () => {
    expect(STUDIO_INBOX_EMAIL).toBe('prospect@gocosmic.dev');
  });
});

describe('getSenderEmail', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the configured sender', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', 'Studio <hello@gocosmic.dev>');

    expect(getSenderEmail()).toBe('Studio <hello@gocosmic.dev>');
  });

  it('trims the configured sender', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '  Studio <hello@gocosmic.dev>  ');

    expect(getSenderEmail()).toBe('Studio <hello@gocosmic.dev>');
  });

  it('falls back to the default when the variable is unset', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', undefined);

    expect(getSenderEmail()).toBe(DEFAULT_SENDER_EMAIL);
  });

  it('falls back to the default when the variable is empty', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '');

    expect(getSenderEmail()).toBe(DEFAULT_SENDER_EMAIL);
  });

  it('falls back to the default when the variable is whitespace only', () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '   ');

    expect(getSenderEmail()).toBe(DEFAULT_SENDER_EMAIL);
  });
});
