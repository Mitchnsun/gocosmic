import { beforeEach, vi } from 'vitest';

import { FREE_MOCKUP_TO_EMAIL, getResendClient, resetResendClient } from '@/lib/resend';

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

  it('targets the prospect inbox', () => {
    expect(FREE_MOCKUP_TO_EMAIL).toBe('prospect@gocosmic.dev');
  });
});
