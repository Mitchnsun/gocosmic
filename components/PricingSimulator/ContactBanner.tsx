'use client';

import { EnvelopeIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

interface ContactBannerProps {
  t: ReturnType<typeof useTranslations<'pricing'>>;
}

export function ContactBanner({ t }: ContactBannerProps) {
  const email = t('contact.email');
  const subject = encodeURIComponent(t('contact.subject'));

  return (
    <div className="border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6">
      <h4 className="font-display text-ghost mb-2 text-lg font-semibold">{t('contact.title')}</h4>
      <p className="text-ghost/55 mb-5 text-sm">{t('contact.description')}</p>
      <a
        href={`mailto:${email}?subject=${subject}`}
        className={cn(buttonVariants({ variant: 'jungle' }), 'inline-flex items-center gap-2')}
        aria-label={t('contact.aria_label')}>
        {t('contact.cta')}
        <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="text-ghost/35 mt-4 font-mono text-sm">{email}</p>
      <p className="text-ghost/35 mt-3 text-sm">
        {t('contact.privacy_notice')}{' '}
        <Link href="/privacy" className="hover:text-ghost/55 underline transition">
          {t('contact.privacy_link')}
        </Link>
        .
      </p>
    </div>
  );
}
