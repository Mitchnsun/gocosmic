'use client';

import { useTranslations } from 'next-intl';

import { ghostPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

/** The two freebies, each with the page where it is requested. */
const OFFERS = [
  { key: 'mockup', href: '/free-mockup' },
  { key: 'audit', href: '/contact' },
] as const;

/** Announces the two no-commitment freebies used in outreach, each with a button to request it. */
export function FreeOffers() {
  const t = useTranslations('pricing');

  return (
    <section aria-labelledby="free-offers-heading" className="border-ok/25 bg-ok/[0.04] w-full rounded-2xl border p-6">
      <p className="text-ok text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="bg-ok absolute inline-flex h-full w-full rounded-full opacity-75" />
          <span className="bg-ok relative inline-flex h-2 w-2 rounded-full" />
        </span>
        {t('free_offers.eyebrow')}
      </p>
      <h2 id="free-offers-heading" className="font-display text-fg mt-3 text-xl font-semibold sm:text-2xl">
        {t('free_offers.title')}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {OFFERS.map(({ key, href }) => (
          <li key={key} className="border-line flex flex-col items-start gap-4 rounded-xl border p-4">
            <div>
              <p className="font-display text-fg text-base font-medium">{t(`free_offers.items.${key}.title`)}</p>
              <p className="text-fg-2 mt-1 text-sm">{t(`free_offers.items.${key}.description`)}</p>
            </div>
            <Link href={href} className={ghostPill('mt-auto')}>
              {t(`free_offers.items.${key}.cta`)}
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-fg-3 mt-4 text-sm">{t('free_offers.note')}</p>
    </section>
  );
}
