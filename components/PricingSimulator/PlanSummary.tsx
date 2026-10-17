'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { Region } from '@/lib/region';

import { MockupLink } from './MockupLink';
import { PriceTotal } from './PriceTotal';
import type { PriceFormat } from './PricingSimulator.hooks';
import type { PlanItem, PlanSelection } from './PricingSimulator.types';
import { getCommittedItems, getPlanItems, isTiered } from './PricingSimulator.utils';

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
  const committed = getCommittedItems(plan);

  const label = (item: PlanItem) => {
    if (item.id === 'formula') return t(`builder.formulas.${plan.formula}.label`);
    if (item.id === 'pages') return t(`builder.pages.tiers.${item.tier}`);
    if (item.id === 'updates') return t('builder.updates.label');
    if (item.id === 'mailboxes') return t('builder.options.mailboxes.count', { count: item.count ?? 0 });
    if (item.id === 'detailed_analytics') return t('builder.options.detailed_analytics.recap_label');
    return t(`builder.options.${item.id}.label`);
  };
  /** Rhythm of a slider line, e.g. "Every month". */
  const detail = (item: PlanItem) => {
    if (item.id === 'updates') return t(`builder.updates.tiers.${item.tier}`);
    if (isTiered(item.id)) return t(`builder.options.${item.id}.tiers.${item.tier}`);
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
        note={t.rich('builder.total.note', {
          link: (chunks) => (
            <Link href="/terms" className={linkClass}>
              {chunks}
            </Link>
          ),
        })}
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
      <p className="border-line text-fg-2 border-t pt-4 text-sm">
        {committed.length > 0
          ? t('builder.commitment_line.periods', {
              items: committed.map((id) => t(`builder.commitment_items.${id}`)).join(', '),
            })
          : t('builder.commitment_line.none')}
      </p>
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
