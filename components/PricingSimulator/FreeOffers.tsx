'use client';

import { useTranslations } from 'next-intl';

const OFFERS = ['mockup', 'audit'] as const;

/** Announces the two no-commitment freebies used in outreach, on the page itself. */
export function FreeOffers() {
  const t = useTranslations('pricing');

  return (
    <section
      aria-labelledby="free-offers-heading"
      className="border-jungle/25 bg-jungle/[0.04] w-full rounded-2xl border p-6">
      <p className="text-jungle text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
        <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
          <span className="bg-jungle absolute inline-flex h-full w-full rounded-full opacity-75" />
          <span className="bg-jungle relative inline-flex h-2 w-2 rounded-full" />
        </span>
        {t('free_offers.eyebrow')}
      </p>
      <h2 id="free-offers-heading" className="font-display text-ghost mt-3 text-xl font-semibold sm:text-2xl">
        {t('free_offers.title')}
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {OFFERS.map((offer) => (
          <li key={offer} className="border-ghost/8 rounded-xl border p-4">
            <p className="font-display text-ghost text-base font-medium">{t(`free_offers.items.${offer}.title`)}</p>
            <p className="text-ghost/55 mt-1 text-sm">{t(`free_offers.items.${offer}.description`)}</p>
          </li>
        ))}
      </ul>
      <p className="text-ghost/35 mt-4 text-sm">{t('free_offers.note')}</p>
    </section>
  );
}
