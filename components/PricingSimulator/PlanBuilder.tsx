'use client';

import { useTranslations } from 'next-intl';

import type { Currency } from '@/lib/region';

import {
  ADD_ON_KEYS,
  BASE_PRICE,
  PAGE_TIER_KEYS,
  PAGE_TIER_PRICES,
  TIER_INDEXES,
  UPDATE_TIER_KEYS,
  UPDATE_TIER_PRICES,
} from './constants';
import { OptionToggle } from './OptionToggle';
import { PriceTotal } from './PriceTotal';
import type { AddOnKey, PlanSelection } from './PricingSimulator.types';
import { formatAmount, getAddOnPrice, getUpdateTierPrice } from './PricingSimulator.utils';
import { TierSlider } from './TierSlider';

interface PlanBuilderProps {
  currency: Currency;
  selection: PlanSelection;
  total: number;
  showQuoteHint: boolean;
  onToggleAddOn: (key: AddOnKey) => void;
  onToggleUpdates: () => void;
  onPagesChange: (value: number) => void;
  onUpdatesChange: (value: number) => void;
}

/** Composable showcase plan: a base price the visitor grows with add-ons and sliders. */
export function PlanBuilder({
  currency,
  selection,
  total,
  showQuoteHint,
  onToggleAddOn,
  onToggleUpdates,
  onPagesChange,
  onUpdatesChange,
}: PlanBuilderProps) {
  const t = useTranslations('pricing');
  const surcharge = (amount: number) => `+${formatAmount(amount, currency)}`;

  // Indexes come from TIER_INDEXES, a fixed list of slider positions.
  /* eslint-disable security/detect-object-injection */
  const pageTiers = TIER_INDEXES.map((index) => ({
    label: t(`builder.pages.tiers.${PAGE_TIER_KEYS[index]}`),
    price: surcharge(PAGE_TIER_PRICES[index]),
  }));

  const updateTiers = TIER_INDEXES.map((index) => ({
    label: t(`builder.updates.tiers.${UPDATE_TIER_KEYS[index]}`),
    price: surcharge(UPDATE_TIER_PRICES[index]),
  }));
  /* eslint-enable security/detect-object-injection */

  return (
    <div className="space-y-6">
      {/* Base plan */}
      <section aria-labelledby="plan-base-heading" className="border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 id="plan-base-heading" className="font-display text-ghost text-xl font-semibold">
            {t('builder.base.title')}
          </h3>
          <p className="font-display text-ghost text-lg font-medium tabular-nums">
            {formatAmount(BASE_PRICE, currency)}
            <span className="text-ghost/55 ml-1 text-sm">{t('builder.period')}</span>
          </p>
        </div>
        <ul className="mt-4 space-y-2">
          {(['page', 'hosting', 'security'] as const).map((item) => (
            <li key={item} className="text-ghost/55 flex items-start gap-3 text-sm">
              <span className="bg-jungle mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
              {t(`builder.base.includes.${item}`)}
            </li>
          ))}
        </ul>
      </section>

      {/* Composable options */}
      <section aria-labelledby="plan-options-heading" className="space-y-3">
        <h3 id="plan-options-heading" className="text-ghost/55 text-2xs font-mono tracking-[0.24em] uppercase">
          {t('builder.options.title')}
        </h3>

        <div className="border-ghost/8 bg-ghost/[0.02] rounded-xl border p-4">
          <TierSlider
            label={t('builder.pages.label')}
            tiers={pageTiers}
            value={selection.pages}
            onChange={onPagesChange}
          />
        </div>

        {ADD_ON_KEYS.map((key) => (
          <OptionToggle
            key={key}
            label={t(`builder.options.${key}.label`)}
            hint={t(`builder.options.${key}.hint`)}
            price={surcharge(getAddOnPrice(key))}
            // eslint-disable-next-line security/detect-object-injection -- key comes from ADD_ON_KEYS
            checked={selection.addOns[key]}
            onChange={() => onToggleAddOn(key)}
          />
        ))}

        <OptionToggle
          label={t('builder.updates.label')}
          hint={t('builder.updates.hint')}
          price={selection.updatesEnabled ? surcharge(getUpdateTierPrice(selection.updates)) : t('builder.updates.off')}
          checked={selection.updatesEnabled}
          onChange={onToggleUpdates}>
          <div className="border-ghost/8 border-t px-4 py-4">
            <TierSlider
              label={t('builder.updates.slider_label')}
              tiers={updateTiers}
              value={selection.updates}
              onChange={onUpdatesChange}
              disabled={!selection.updatesEnabled}
            />
          </div>
        </OptionToggle>
      </section>

      {/* Live total */}
      <PriceTotal
        label={t('builder.total.label')}
        amount={formatAmount(total, currency)}
        period={t('builder.period')}
        note={t('builder.total.note')}
      />

      {showQuoteHint && (
        <p className="border-aerospace/30 bg-aerospace/[0.04] text-ghost/55 rounded-xl border px-4 py-3 text-sm">
          {t('builder.total.beyond')}
        </p>
      )}
    </div>
  );
}
