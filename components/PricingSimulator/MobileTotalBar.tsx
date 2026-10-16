'use client';

import { useTranslations } from 'next-intl';

import type { Region } from '@/lib/region';

import { MockupLink } from './MockupLink';
import type { PlanSelection } from './PricingSimulator.types';

interface MobileTotalBarProps {
  /** Normalised plan. */
  plan: PlanSelection;
  region: Region;
  /** Pre-formatted monthly total, e.g. `25 €`. */
  total: string;
}

/**
 * Below `lg`, the recap only comes after every option: this bar keeps the total and the free mockup
 * request at the bottom of the screen while the options scroll by. It sticks inside the options
 * column, so it leaves with them. The recap's total is the one announced to screen readers.
 */
export function MobileTotalBar({ plan, region, total }: MobileTotalBarProps) {
  const t = useTranslations('pricing.builder');

  return (
    <div className="border-line-2 bg-bg/95 sticky bottom-0 z-30 -mx-4 flex items-center justify-between gap-3 border-t px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
      <p className="text-fg-2 text-sm">
        {t('total.label')} ·{' '}
        <span className="font-display text-aerospace-ink text-lg font-bold tabular-nums">{total}</span> {t('period')}
      </p>
      <MockupLink plan={plan} region={region} className="shrink-0">
        {t('total.mobile_cta')}
      </MockupLink>
    </div>
  );
}
