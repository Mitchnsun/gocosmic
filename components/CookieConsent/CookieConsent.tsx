'use client';

import { Analytics } from '@vercel/analytics/next';
import { useTranslations } from 'next-intl';

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
          className="fixed right-4 bottom-4 left-4 z-50 m-auto max-w-2xl rounded-lg border border-slate-700 bg-slate-950 p-5 text-gray-200 shadow-2xl md:left-auto"
          aria-labelledby="cookie-consent-title">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cookie-consent-title" className="text-lg font-bold text-white">
                  {t('title')}
                </h2>
                <p className="mt-2 text-sm text-gray-300">{t('description')}</p>
              </div>
              {isDismissable && (
                <button
                  type="button"
                  aria-label={t('close')}
                  className="shrink-0 rounded p-1 text-gray-500 transition hover:text-gray-200 focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
              <div className="flex items-start gap-3 rounded border border-slate-700 bg-slate-900 p-3 text-sm">
                <input
                  id="analytics-consent"
                  type="checkbox"
                  className="mt-1"
                  checked={analyticsEnabled}
                  onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                />
                <label htmlFor="analytics-consent">
                  <span className="block font-semibold text-white">{t('analyticsTitle')}</span>
                  <span className="text-gray-400">{t('analyticsDescription')}</span>
                </label>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                className="rounded bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-400 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                onClick={() => saveChoice('accepted')}>
                {t('accept')}
              </button>
              <button
                type="button"
                className="rounded border border-slate-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                onClick={() => saveChoice('refused')}>
                {t('refuse')}
              </button>
              <button
                type="button"
                className="rounded px-4 py-2 text-sm font-semibold text-gray-300 underline transition hover:text-white focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
                className="rounded px-4 py-2 text-sm font-semibold text-blue-300 underline transition hover:text-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none">
                {t('privacyLink')}
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
