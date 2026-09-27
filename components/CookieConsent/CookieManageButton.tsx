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
      className={cn('text-ghost/70 hover:text-ghost underline underline-offset-4 transition', className)}
      onClick={openManage}>
      {t('manage')}
    </button>
  );
}
