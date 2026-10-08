'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { ONE_YEAR_OPTIONS, TIERED_TABLES } from './constants';
import { OptionToggle } from './OptionToggle';
import type { TieredKey } from './PricingSimulator.types';
import { TierSlider } from './TierSlider';

interface TieredOptionProps {
  id: TieredKey;
  /** Chosen tier, or `null` while unticked. */
  value: number | null;
  onToggle: (id: TieredKey) => void;
  onTierChange: (id: TieredKey, value: number) => void;
  surcharge: (amount: number) => string;
  /** Sentence appended to the info bubble. */
  extraInfo?: string;
  /** Sub-options shown under the slider once ticked. */
  children?: ReactNode;
}

/** Tick box revealing a slider of tiers (statistics report, local search rhythm, articles). */
export function TieredOption({ id, value, onToggle, onTierChange, surcharge, extraInfo, children }: TieredOptionProps) {
  const t = useTranslations('pricing.builder');
  // eslint-disable-next-line security/detect-object-injection -- id is a TieredKey
  const table = TIERED_TABLES[id];
  const tiers = table.map((tier) => ({ label: t(`options.${id}.tiers.${tier.key}`), price: surcharge(tier.price) }));
  const label = t(`options.${id}.label`);
  // eslint-disable-next-line security/detect-object-injection -- value is a clamped tier position
  const current = value === null ? undefined : tiers[value];

  return (
    <OptionToggle
      label={label}
      hint={t(`options.${id}.hint`)}
      price={current?.price ?? t('from', { price: surcharge(table[0].price) })}
      checked={value !== null}
      onChange={() => onToggle(id)}
      info={{
        label: t('info_label', { option: label }),
        text: [t(`options.${id}.info`), extraInfo].filter(Boolean).join(' '),
      }}
      commitment={ONE_YEAR_OPTIONS.has(id) ? t('commitment') : undefined}>
      {value !== null && (
        <div className="border-line space-y-4 border-t px-4 py-4">
          <TierSlider
            label={t(`options.${id}.slider_label`)}
            tiers={tiers}
            value={value}
            onChange={(next) => onTierChange(id, next)}
          />
          {children}
        </div>
      )}
    </OptionToggle>
  );
}
