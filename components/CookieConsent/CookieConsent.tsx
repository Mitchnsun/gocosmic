'use client';

import { Analytics } from '@vercel/analytics/next';
import { useTranslations } from 'next-intl';

import { CHECKBOX_CONTROL } from '@/design-system/field';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

import { useCookieConsent } from './CookieConsentContext';

export function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const {
    isReady,
    choice,
    isCustomizing,
    isDismissable,
    analyticsEnabled,
    closeManage,
    saveChoice,
    setIsCustomizing,
    setAnalyticsEnabled,
  } = useCookieConsent();

  if (!isReady) return null;

  return (
    <>
      {choice === 'accepted' && <Analytics />}
      {choice === null && (
        <section
          className="border-line-2 bg-bg text-fg fixed right-4 bottom-4 left-4 z-50 m-auto max-w-2xl rounded-2xl border p-5 md:left-auto"
          aria-labelledby="cookie-consent-title">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cookie-consent-title" className="font-display text-fg text-lg font-bold">
                  {t('title')}
                </h2>
                <p className="text-fg-2 mt-2 text-sm">{t('description')}</p>
              </div>
              {isDismissable && (
                <button
                  type="button"
                  aria-label={t('close')}
                  className="text-fg-3 hover:text-fg focus:ring-fg shrink-0 rounded-full p-1 transition focus:ring-2 focus:outline-none"
                  onClick={closeManage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {isCustomizing && (
              <div className="border-line-2 bg-surface flex items-start gap-3 rounded-xl border p-3 text-sm">
                <input
                  id="analytics-consent"
                  type="checkbox"
                  className={cn(CHECKBOX_CONTROL, 'mt-0.5')}
                  checked={analyticsEnabled}
                  onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                />
                <label htmlFor="analytics-consent">
                  <span className="text-fg block font-semibold">{t('analyticsTitle')}</span>
                  <span className="text-fg-2">{t('analyticsDescription')}</span>
                </label>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="font-display bg-aerospace text-void hover:bg-aerospace/90 focus:ring-fg rounded-full px-4 py-2 text-sm font-semibold transition focus:ring-2 focus:outline-none"
                onClick={() => saveChoice('accepted')}>
                {t('accept')}
              </button>
              <button
                type="button"
                className="font-display border-line-2 text-fg hover:border-fg hover:bg-line focus:ring-fg rounded-full border px-4 py-2 text-sm font-semibold transition focus:ring-2 focus:outline-none"
                onClick={() => saveChoice('refused')}>
                {t('refuse')}
              </button>
              <button
                type="button"
                className="font-display text-fg-2 hover:text-fg focus:ring-fg rounded-full px-4 py-2 text-sm font-semibold underline underline-offset-4 transition focus:ring-2 focus:outline-none"
                onClick={() => {
                  if (isCustomizing) {
                    saveChoice(analyticsEnabled ? 'accepted' : 'refused');
                  } else {
                    setIsCustomizing(true);
                  }
                }}>
                {isCustomizing ? t('save') : t('customize')}
              </button>
              <Link
                href="/privacy"
                className="font-display text-fg-2 hover:text-fg focus:ring-fg rounded-full px-4 py-2 text-sm font-semibold underline underline-offset-4 transition focus:ring-2 focus:outline-none">
                {t('privacyLink')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
