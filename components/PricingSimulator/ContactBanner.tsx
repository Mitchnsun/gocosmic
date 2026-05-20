'use client';

import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

interface ContactBannerProps {
  t: ReturnType<typeof useTranslations<'pricing'>>;
}

export function ContactBanner({ t }: ContactBannerProps) {
  const email = t('contact.email');
  const subject = encodeURIComponent(t('contact.subject'));

  return (
    <div className="mt-6 rounded-lg border border-slate-600 bg-slate-900/60 px-6 py-6">
      <h4 className="mb-2 text-base font-semibold text-white">{t('contact.title')}</h4>
      <p className="mb-4 text-sm text-gray-400">{t('contact.description')}</p>
      <a
        href={`mailto:${email}?subject=${subject}`}
        className="text-jungle ring-jungle hover:bg-jungle/10 focus:ring-jungle inline-flex items-center gap-2 rounded px-4 py-2 font-semibold ring-2 transition-colors focus:outline-none"
        aria-label={t('contact.aria_label')}>
        {t('contact.cta')}
        <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-sm text-gray-500">{email}</p>
    </div>
  );
}
