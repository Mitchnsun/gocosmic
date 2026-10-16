'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import type { Currency, Region } from '@/lib/region';

import { AddressOptions } from './AddressOptions';
import { BaseCard } from './BaseCard';
import { CareOptions } from './CareOptions';
import { MoreOptions } from './MoreOptions';
import { type SimulatorActions, usePriceFormat } from './PricingSimulator.hooks';
import type { Cascade } from './PricingSimulator.rules';
import type { PlanSelection } from './PricingSimulator.types';
import { SiteOptions } from './SiteOptions';

interface PlanBuilderProps {
  currency: Currency;
  region: Region;
  plan: PlanSelection;
  cascade: Cascade | null;
  actions: SimulatorActions;
}

/**
 * Composable plan: what the formula includes, then the common options grouped by purpose, and the
 * others folded under "More options". The total lives in `PlanSummary`.
 */
export function PlanBuilder({ currency, region, plan, cascade, actions }: PlanBuilderProps) {
  const t = useTranslations('pricing.builder');
  const { surcharge } = usePriceFormat(currency);
  const headingId = useId();
  const group = { plan, actions, surcharge };
  const domain = t(`options.example_domain.${region}`);

  return (
    <div className="space-y-6">
      <BaseCard formula={plan.formula} currency={currency} />
      <section aria-labelledby={headingId} className="space-y-6">
        <h3 id={headingId} className="font-display text-fg text-xl font-semibold">
          {t('options.title')}
        </h3>
        <SiteOptions {...group} />
        <AddressOptions {...group} domain={domain} cascade={cascade} />
        <CareOptions {...group} />
        <MoreOptions {...group} domain={domain} region={region} cascade={cascade} />
      </section>
    </div>
  );
}
