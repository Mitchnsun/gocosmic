'use client';

import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import type { Currency } from '@/lib/region';

const features = [
  { key: 'redesign', asterisk: false },
  { key: 'seo', asterisk: false },
  { key: 'updates', asterisk: false },
  { key: 'hosting', asterisk: false },
  { key: 'ssl', asterisk: false },
  { key: 'domain', asterisk: true },
] as const;

interface PricingTeaserProps {
  currency: Currency;
}

export function PricingTeaser({ currency }: PricingTeaserProps) {
  const t = useTranslations('pricing_teaser');

  return (
    <div className="w-full rounded-lg bg-slate-800 px-6 py-8 ring-1 ring-slate-700">
      {/* Price */}
      <p className="mb-1 text-sm font-medium tracking-wide text-gray-400 uppercase">{t('eyebrow')}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-jungle text-4xl font-extrabold">{t(`price.${currency}`)}</span>
        <span className="text-jungle text-sm font-medium">{t('price_period')}</span>
      </div>
      <p className="mt-1 mb-3 text-gray-400">{t('tagline')}</p>
      <p className="mb-6 text-sm text-gray-500">{t('scope_note')}</p>

      {/* Feature list */}
      <ul className="mb-2 space-y-2">
        {features.map(({ key, asterisk }) => (
          <li key={key} className="flex items-center gap-3">
            <CheckCircleIcon className="text-jungle h-5 w-5 shrink-0" aria-hidden="true" />
            <span className="text-gray-300">
              {t(`features.${key}`)}
              {asterisk && <sup className="ml-0.5 text-gray-500">*</sup>}
            </span>
          </li>
        ))}
      </ul>
      <p className="mb-1 text-xs text-gray-500">{t('footnote')}</p>
      <p className="mb-6 text-xs text-gray-500">{t('footnote_scope')}</p>

      {/* Mockup mention */}
      <p className="mb-6 flex items-center gap-2 text-sm text-gray-300 italic">
        <SparklesIcon className="text-jungle h-4 w-4 shrink-0" aria-hidden="true" />
        {t('mockup_mention')}
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3">
        <Link href="/pricing" className={cn(buttonVariants({ variant: 'jungle' }))}>
          {t('cta_simulate')}
        </Link>
        <Link href="/contact" className={cn(buttonVariants({ variant: 'outer-space' }))}>
          {t('cta_contact')}
        </Link>
      </div>
    </div>
  );
}
