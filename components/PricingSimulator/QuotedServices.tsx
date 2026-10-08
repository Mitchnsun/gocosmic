'use client';

import { useTranslations } from 'next-intl';

import { ghostPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

const SERVICES = ['logo', 'print', 'photo_video'] as const;

/** Services outside the subscription, made with partners and quoted on request. */
export function QuotedServices() {
  const t = useTranslations('pricing.quoted_services');

  return (
    <section aria-labelledby="quoted-services-heading" className="border-line bg-surface w-full rounded-2xl border p-6">
      <p className="text-fg-3 text-2xs font-mono tracking-[0.24em] uppercase">{t('eyebrow')}</p>
      <h2 id="quoted-services-heading" className="font-display text-fg mt-3 text-xl font-semibold sm:text-2xl">
        {t('title')}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <li key={service} className="border-line rounded-xl border p-4">
            <p className="font-display text-fg text-base font-medium">{t(`items.${service}.title`)}</p>
            <p className="text-fg-2 mt-1 text-sm">{t(`items.${service}.description`)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-fg-3 max-w-[60ch] text-sm">{t('note')}</p>
        <Link href="/contact" className={ghostPill('w-fit shrink-0')}>
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
