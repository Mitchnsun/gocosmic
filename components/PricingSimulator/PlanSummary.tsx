'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { primaryPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { encodePlanCode } from '@/lib/pricing/plan-code';
import { storePlanCode } from '@/lib/pricing/plan-storage';
import type { Currency, Region } from '@/lib/region';

import { PriceTotal } from './PriceTotal';
import { usePriceFormat } from './PricingSimulator.hooks';
import type { PlanItem, PlanSelection } from './PricingSimulator.types';
import { getPlanItems } from './PricingSimulator.utils';

interface PlanSummaryProps {
  currency: Currency;
  region: Region;
  /** Normalised plan. */
  plan: PlanSelection;
  total: number;
  showQuoteHint: boolean;
}

/**
 * Sticky recap of the composed plan: itemised lines, live total, and the free
 * mockup request carrying the simulation along.
 */
export function PlanSummary({ currency, region, plan, total, showQuoteHint }: PlanSummaryProps) {
  const t = useTranslations('pricing');
  const { price, surcharge } = usePriceFormat(currency);

  const label = (item: PlanItem) => {
    if (item.id === 'formula') return t(`builder.formulas.${plan.formula}.label`);
    if (item.id === 'pages') return t(`builder.pages.tiers.${item.tier}`);
    if (item.id === 'updates') return t('builder.updates.label');
    if (item.id === 'mailboxes') return t('builder.options.mailboxes.count', { count: item.count ?? 0 });
    return t(`builder.options.${item.id}.label`);
  };
  /** Rhythm of a slider line, e.g. "Every month". */
  const detail = (item: PlanItem) => {
    if (item.id === 'updates') return t(`builder.updates.tiers.${item.tier}`);
    if (item.id === 'analytics' || item.id === 'seo' || item.id === 'articles')
      return t(`builder.options.${item.id}.tiers.${item.tier}`);
    return undefined;
  };
  const amount = (item: PlanItem) => {
    if (item.id === 'formula') return price(item.amount);
    return item.tier === 'ten_plus'
      ? t('builder.pages.or_more', { price: surcharge(item.amount) })
      : surcharge(item.amount);
  };

  return (
    <aside aria-label={t('builder.total.label')} className="flex flex-col gap-4 lg:sticky lg:top-24">
      <PriceTotal
        label={t('builder.total.label')}
        amount={price(total)}
        period={t('builder.period')}
        note={t('builder.total.note')}
      />
      <ul className="border-line text-fg-2 flex flex-col gap-2 border-t pt-4 text-sm">
        {getPlanItems(plan).map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span>
              <span>{label(item)}</span>
              {detail(item) && <span className="text-fg-3"> · {detail(item)}</span>}
            </span>
            <span className="text-fg shrink-0 font-mono tabular-nums">{amount(item)}</span>
          </li>
        ))}
      </ul>
      {showQuoteHint && (
        <p className="border-aerospace/30 bg-aerospace/[0.04] text-fg-2 rounded-xl border px-4 py-3 text-sm">
          {t('builder.total.beyond')}
        </p>
      )}
      <Link
        href="/free-mockup"
        onClick={() =>
          storePlanCode(encodePlanCode({ projectType: 'website', websiteType: 'showcase', selection: plan, region }))
        }
        className={primaryPill('w-full')}>
        {t('builder.total.cta')}
        <ArrowRightIcon className="size-4" aria-hidden="true" />
      </Link>
      <p className="text-fg-3 text-center text-sm">
        {t.rich('builder.total.question', {
          link: (chunks) => (
            <Link href="/contact" className="text-fg-2 hover:text-fg underline underline-offset-4">
              {chunks}
            </Link>
          ),
        })}
      </p>
    </aside>
  );
}
