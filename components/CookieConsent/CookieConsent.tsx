'use client';

import { Analytics } from '@vercel/analytics/next';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Link } from '@/i18n/navigation';

const STORAGE_KEY = 'gocosmic.analytics-consent';

type ConsentChoice = 'accepted' | 'refused';

export function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const storedChoice = window.localStorage.getItem(STORAGE_KEY) as ConsentChoice | null;
    if (storedChoice === 'accepted' || storedChoice === 'refused') {
      setChoice(storedChoice);
      setAnalyticsEnabled(storedChoice === 'accepted');
    }
    setIsReady(true);
  }, []);

  const saveChoice = (nextChoice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, nextChoice);
    setChoice(nextChoice);
    setAnalyticsEnabled(nextChoice === 'accepted');
  };

  if (!isReady) return null;

  return (
    <>
      {choice === 'accepted' && <Analytics />}
      {choice !== null && (
        <button
          type="button"
          className="fixed right-4 bottom-4 z-50 rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-semibold text-gray-200 shadow-lg transition hover:bg-slate-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          onClick={() => {
            setIsCustomizing(true);
            setChoice(null);
          }}>
          {t('manage')}
        </button>
      )}
      {choice === null && (
        <section
          className="fixed right-4 bottom-4 left-4 z-50 m-auto max-w-2xl rounded-lg border border-slate-700 bg-slate-950 p-5 text-gray-200 shadow-2xl md:left-auto"
          aria-labelledby="cookie-consent-title">
          <div className="space-y-4">
            <div>
              <h2 id="cookie-consent-title" className="text-lg font-bold text-white">
                {t('title')}
              </h2>
              <p className="mt-2 text-sm text-gray-300">{t('description')}</p>
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
