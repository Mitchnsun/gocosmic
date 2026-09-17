import { beforeEach, vi } from 'vitest';

import { submitFreeMockupRequest } from '@/app/actions/free-mockup';
import type { FreeMockupFormState } from '@/components/FreeMockupForm/FreeMockupForm.types';

const send = vi.hoisted(() => vi.fn());

vi.mock('@/lib/resend', () => ({
  FREE_MOCKUP_FROM_EMAIL: 'Go Cosmic <noreply@gocosmic.dev>',
  FREE_MOCKUP_TO_EMAIL: 'prospect@gocosmic.dev',
  getResendClient: () => ({ emails: { send } }),
}));

const INITIAL: FreeMockupFormState = { status: 'idle' };

const buildFormData = (overrides: Record<string, string> = {}) => {
  const formData = new FormData();
  const fields: Record<string, string> = {
    email: 'prospect@example.com',
    colorPalette: 'alpineSunset',
    websiteUrl: 'https://example.com',
    wishes: 'Something calm and readable.',
    locale: 'fr',
    company: '',
    ...overrides,
  };

  for (const [name, value] of Object.entries(fields)) {
    formData.set(name, value);
  }

  return formData;
};

describe('submitFreeMockupRequest', () => {
  beforeEach(() => {
    send.mockReset();
    send.mockResolvedValue({ data: { id: 'email-id' }, error: null });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('sends the request to the prospect inbox and reports success', async () => {
    const state = await submitFreeMockupRequest(INITIAL, buildFormData());

    expect(state).toEqual({ status: 'success' });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Go Cosmic <noreply@gocosmic.dev>',
        to: ['prospect@gocosmic.dev'],
        replyTo: 'prospect@example.com',
        subject: 'Demande de maquette gratuite — prospect@example.com',
      })
    );

    const payload = send.mock.calls[0]?.[0] as { text: string; html: string };
    expect(payload.text).toContain('Alpine sunset (alpineSunset)');
    expect(payload.text).toContain('Locale: fr');
    expect(payload.html).toContain('https://example.com');
  });

  it('falls back to the default locale when the submitted one is unknown', async () => {
    await submitFreeMockupRequest(INITIAL, buildFormData({ locale: 'kr' }));

    expect((send.mock.calls[0]?.[0] as { text: string }).text).toContain('Locale: en');
  });

  it('drops a request whose honeypot is filled, without sending anything', async () => {
    const state = await submitFreeMockupRequest(INITIAL, buildFormData({ company: 'ACME Corp' }));

    expect(state).toEqual({ status: 'success' });
    expect(send).not.toHaveBeenCalled();
  });

  it('returns field errors for an invalid payload', async () => {
    const state = await submitFreeMockupRequest(
      INITIAL,
      buildFormData({ email: 'nope', colorPalette: '', websiteUrl: 'example' })
    );

    expect(state).toEqual({
      status: 'error',
      fieldErrors: { email: 'email_invalid', colorPalette: 'required', websiteUrl: 'url_invalid' },
    });
    expect(send).not.toHaveBeenCalled();
  });

  it('reports an error when the provider rejects the email', async () => {
    send.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'nope' } });

    expect(await submitFreeMockupRequest(INITIAL, buildFormData())).toEqual({ status: 'error' });
  });

  it('reports an error when the provider call throws', async () => {
    send.mockRejectedValue(new Error('network down'));

    expect(await submitFreeMockupRequest(INITIAL, buildFormData())).toEqual({ status: 'error' });
  });
});
