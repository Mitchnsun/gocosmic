'use client';

import { useTranslations } from 'next-intl';

import { useCookieConsent } from './CookieConsentContext';

export function CookieManageButton() {
  const t = useTranslations('cookieConsent');
  const { openManage } = useCookieConsent();

  return (
    <button type="button" className="text-gray-300 underline transition hover:text-white" onClick={openManage}>
      {t('manage')}
    </button>
  );
}
