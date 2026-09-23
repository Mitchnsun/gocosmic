'use client';

import { SparklesIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { AccentList } from '@/components/AccentList';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import type { Currency } from '@/lib/region';

/** What the base plan covers: a single page, hosting included. Domain, email and extra pages are paid options. */
const features = ['page', 'redesign', 'seo', 'updates', 'hosting', 'ssl'] as const;

interface PricingTeaserProps {
  currency: Currency;
}

export function PricingTeaser({ currency }: PricingTeaserProps) {
  const t = useTranslations('pricing_teaser');
  const subject = encodeURIComponent(t('cta_contact_email_subject'));

  return (
    <div className="border-ghost/8 bg-ghost/[0.02] w-full rounded-2xl border p-6 sm:p-8 lg:p-10">
      {/* Price */}
      <p className="text-jungle text-2xs mb-4 flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
        <span className="bg-jungle h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        {t('eyebrow')}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-jungle font-display text-4xl font-semibold">{t(`price.${currency}`)}</span>
        <span className="text-jungle text-sm font-medium">{t('price_period')}</span>
      </div>
      <p className="text-ghost/55 mt-1 mb-3">{t('tagline')}</p>
      <p className="text-ghost/35 mb-6 text-sm">{t('scope_note')}</p>

      {/* Feature list */}
      <AccentList accent="jungle" columns={2} items={features.map((key) => t(`features.${key}`))} className="mb-4" />
      <p className="text-ghost/35 mb-1 text-xs">{t(`footnote.${currency}`)}</p>
      <p className="text-ghost/35 mb-6 text-xs">{t('footnote_scope')}</p>

      {/* Mockup mention */}
      <p className="text-ghost/80 mb-6 flex items-center gap-2 text-sm italic">
        <SparklesIcon className="text-jungle h-4 w-4 shrink-0" aria-hidden="true" />
        {t('mockup_mention')}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href="/pricing" className={cn(buttonVariants({ variant: 'jungle' }))}>
          {t('cta_simulate')}
        </Link>
        <a
          href={`mailto:prospect@gocosmic.dev?subject=${subject}`}
          className={cn(buttonVariants({ variant: 'outer-space' }))}
          aria-label={t('cta_contact_aria_label')}>
          {t('cta_contact')}
        </a>
      </div>
    </div>
  );
}
