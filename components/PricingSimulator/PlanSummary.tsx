'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { primaryPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { encodePlanCode } from '@/lib/pricing/plan-code';
import { storePlanCode } from '@/lib/pricing/plan-storage';
import type { Currency, Region } from '@/lib/region';

import { ADD_ON_KEYS, BASE_PRICE, PAGE_TIER_KEYS } from './constants';
import { PriceTotal } from './PriceTotal';
import type { PlanSelection } from './PricingSimulator.types';
import { formatAmount, getAddOnPrice, getPageTierPrice, getUpdateTierPrice } from './PricingSimulator.utils';

interface PlanSummaryProps {
  currency: Currency;
  region: Region;
  selection: PlanSelection;
  total: number;
  showQuoteHint: boolean;
}

/**
 * Sticky recap of the composed plan: itemised lines, live total, and the free
 * mockup request carrying the simulation along.
 */
export function PlanSummary({ currency, region, selection, total, showQuoteHint }: PlanSummaryProps) {
  const t = useTranslations('pricing');
  const price = (amount: number) => formatAmount(amount, currency);

  // Keys come from the fixed ADD_ON_KEYS / PAGE_TIER_KEYS lists.
  /* eslint-disable security/detect-object-injection */
  const lines = [
    { label: t('builder.base.title'), amount: price(BASE_PRICE) },
    ...(selection.pages > 0
      ? [
          {
            label: t(`builder.pages.tiers.${PAGE_TIER_KEYS[selection.pages]}`),
            amount: `+${price(getPageTierPrice(selection.pages))}`,
          },
        ]
      : []),
    ...ADD_ON_KEYS.filter((key) => selection.addOns[key]).map((key) => ({
      label: t(`builder.options.${key}.label`),
      amount: `+${price(getAddOnPrice(key))}`,
    })),
    ...(selection.updatesEnabled
      ? [{ label: t('builder.updates.label'), amount: `+${price(getUpdateTierPrice(selection.updates))}` }]
      : []),
  ];
  /* eslint-enable security/detect-object-injection */

  return (
    <aside aria-label={t('builder.total.label')} className="flex flex-col gap-4 lg:sticky lg:top-24">
      <PriceTotal
        label={t('builder.total.label')}
        amount={price(total)}
        period={t('builder.period')}
        note={t('builder.total.note')}
      />
      <ul className="border-ghost/8 text-ghost/70 flex flex-col gap-2 border-t pt-4 text-sm">
        {lines.map((line) => (
          <li key={line.label} className="flex justify-between gap-4">
            <span>{line.label}</span>
            <span className="text-ghost font-mono tabular-nums">{line.amount}</span>
          </li>
        ))}
      </ul>
      {showQuoteHint && (
        <p className="border-aerospace/30 bg-aerospace/[0.04] text-ghost/70 rounded-xl border px-4 py-3 text-sm">
          {t('builder.total.beyond')}
        </p>
      )}
      <Link
        href="/free-mockup"
        onClick={() =>
          storePlanCode(encodePlanCode({ projectType: 'website', websiteType: 'showcase', selection, region }))
        }
        className={primaryPill('w-full')}>
        {t('builder.total.cta')}
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Link>
      <p className="text-ghost/45 text-center text-sm">
        {t.rich('builder.total.question', {
          link: (chunks) => (
            <Link href="/contact" className="text-ghost/75 hover:text-ghost underline underline-offset-4">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </aside>
  );
}
