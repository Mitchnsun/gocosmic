import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { CookieConsent, CookieConsentProvider } from '@/components/CookieConsent';

import messages from '../../messages/en/common.json';

// Server values of the module constants: jsdom has a `window`, so they would read as the browser's.
vi.mock('@/components/CookieConsent/CookieConsent.boot', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/CookieConsent/CookieConsent.boot')>()),
  BANNER_STARTS_HIDDEN: true,
}));
vi.mock('@/components/Theme/Theme.boot', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/components/Theme/Theme.boot')>()),
  BOOT_SCRIPT_TYPE: undefined,
}));

describe('CookieConsent on the server', () => {
  it('renders the banner hidden, followed by the script that reveals it once parsed', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CookieConsentProvider>
          <CookieConsent />
        </CookieConsentProvider>
      </NextIntlClientProvider>
    );

    expect(html).toMatch(/<section data-cookie-banner="true" hidden=""/);
    expect(html).toContain('Privacy preferences');
    expect(html).toMatch(/<\/section><script>\(function revealConsentBanner/);
  });
});
