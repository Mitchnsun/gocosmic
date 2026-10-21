'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { Region } from '@/lib/region';

import { MockupLink } from './MockupLink';
import { PriceTotal } from './PriceTotal';
import type { PriceFormat } from './PricingSimulator.hooks';
import { getCommitmentLine, getPlanItemDetail, getPlanItemLabel } from './PricingSimulator.labels';
import type { PlanItem, PlanSelection } from './PricingSimulator.types';
import { getPlanItems } from './PricingSimulator.utils';

interface PlanSummaryProps {
  format: PriceFormat;
  region: Region;
  /** Normalised plan. */
  plan: PlanSelection;
  total: number;
  showQuoteHint: boolean;
}

const linkClass = 'text-fg-2 hover:text-fg underline underline-offset-4';

/**
 * Sticky recap of the composed plan: itemised lines, live total, whether it commits for 12 months,
 * and the free mockup request carrying the simulation along.
 */
export function PlanSummary({ format, region, plan, total, showQuoteHint }: PlanSummaryProps) {
  const t = useTranslations('pricing');
  const { price, surcharge } = format;
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
        note={t.rich('builder.total.note', {
          link: (chunks) => (
            <Link href="/terms" className={linkClass}>
              {chunks}
            </Link>
          ),
        })}
      />
      <ul className="border-line text-fg-2 flex flex-col gap-2 border-t pt-4 text-sm">
        {getPlanItems(plan).map((item) => {
          const detail = getPlanItemDetail(t, item);
          return (
            <li key={item.id} className="flex justify-between gap-4">
              <span>
                <span>{getPlanItemLabel(t, plan, item)}</span>
                {detail && <span className="text-fg-3"> · {detail}</span>}
              </span>
              <span className="text-fg shrink-0 font-mono tabular-nums">{amount(item)}</span>
            </li>
          );
        })}
      </ul>
      <p className="border-line text-fg-2 border-t pt-4 text-sm">{getCommitmentLine(t, plan)}</p>
      {showQuoteHint && (
        <p className="border-aerospace/30 bg-aerospace/[0.04] text-fg-2 rounded-xl border px-4 py-3 text-sm">
          {t('builder.total.beyond')}
        </p>
      )}
      <MockupLink plan={plan} region={region} className="w-full">
        {t('builder.total.cta')}
      </MockupLink>
      <p className="text-fg-3 text-center text-sm">
        {t.rich('builder.total.question', {
          link: (chunks) => (
            <Link href="/contact" className={linkClass}>
              {chunks}
            </Link>
          ),
        })}
      </p>
    </aside>
  );
}
