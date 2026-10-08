'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import type { Currency, Region } from '@/lib/region';

import { AddressOptions } from './AddressOptions';
import { BaseCard } from './BaseCard';
import { CareOptions } from './CareOptions';
import { type SimulatorActions, usePriceFormat } from './PricingSimulator.hooks';
import type { PlanSelection } from './PricingSimulator.types';
import { SiteOptions } from './SiteOptions';
import { VisibilityOptions } from './VisibilityOptions';

interface PlanBuilderProps {
  currency: Currency;
  region: Region;
  plan: PlanSelection;
  updatesRaised: boolean;
  actions: SimulatorActions;
}

/** Composable plan: the formula and what it includes, then the options grouped by purpose. The total lives in `PlanSummary`. */
export function PlanBuilder({ currency, region, plan, updatesRaised, actions }: PlanBuilderProps) {
  const t = useTranslations('pricing.builder');
  const { surcharge } = usePriceFormat(currency);
  const headingId = useId();
  const group = { plan, actions, surcharge };
  const domain = t(`options.example_domain.${region}`);

  return (
    <div className="space-y-6">
      <BaseCard formula={plan.formula} currency={currency} />
      <section aria-labelledby={headingId} className="space-y-6">
        <h3 id={headingId} className="text-fg-2 text-2xs font-mono tracking-[0.24em] uppercase">
          {t('options.title')}
        </h3>
        <SiteOptions {...group} />
        <AddressOptions {...group} domain={domain} region={region} />
        <VisibilityOptions {...group} />
        <CareOptions {...group} updatesRaised={updatesRaised} />
      </section>
    </div>
  );
}
