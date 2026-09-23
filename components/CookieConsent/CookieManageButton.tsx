'use client';

import { useTranslations } from 'next-intl';

import { cn } from '@/design-system/lib/utils';

import { useCookieConsent } from './CookieConsentContext';

export function CookieManageButton({ className }: { className?: string }) {
  const t = useTranslations('cookieConsent');
  const { openManage } = useCookieConsent();

  return (
    <button
      type="button"
      className={cn('text-gray-300 underline transition hover:text-white', className)}
      onClick={openManage}>
      {t('manage')}
    </button>
  );
}
