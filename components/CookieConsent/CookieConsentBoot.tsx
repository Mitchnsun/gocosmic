'use client';

import { BOOT_SCRIPT_TYPE } from '@/components/Theme/Theme.boot';

import { CONSENT_REVEAL_SCRIPT } from './CookieConsent.boot';

/** Inline script revealing the server-rendered banner; render it right after the banner. */
export function CookieConsentBoot() {
  return (
    <script
      type={BOOT_SCRIPT_TYPE}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: CONSENT_REVEAL_SCRIPT }}
    />
  );
}
