'use client';

import { useTranslations } from 'next-intl';

import { UPDATE_TIERS } from './constants';
import { OptionGroup } from './OptionGroup';
import { OptionToggle } from './OptionToggle';
import type { OptionGroupProps } from './PricingSimulator.types';
import { TierSlider } from './TierSlider';

/**
 * "Updates and follow-up": changes to the pages made by the studio. One a year is included; ticking
 * the box enables the rhythm slider. News and articles have their own options and never count here.
 */
export function CareOptions({ plan, actions, surcharge }: OptionGroupProps) {
  const t = useTranslations('pricing.builder');
  const label = t('updates.label');
  const updateTiers = UPDATE_TIERS.map((tier) => ({
    label: t(`updates.tiers.${tier.key}`),
    price: surcharge(tier.price),
  }));

  return (
    <OptionGroup title={t('groups.care')}>
      <OptionToggle
        label={label}
        hint={t(plan.formula === 'self_service' ? 'updates.hint_self_service' : 'updates.hint')}
        price={plan.updatesEnabled ? surcharge(UPDATE_TIERS[plan.updates].price) : t('updates.off')}
        checked={plan.updatesEnabled}
        onChange={actions.toggleUpdates}
        info={{ label: t('info_label', { option: label }), text: t('updates.info') }}>
        <div className="border-line border-t px-4 py-4">
          <TierSlider
            label={t('updates.slider_label')}
            tiers={updateTiers}
            value={plan.updates}
            onChange={actions.setUpdates}
            disabled={!plan.updatesEnabled}
            disabledHint={t('updates.disabled_hint')}
          />
        </div>
      </OptionToggle>
    </OptionGroup>
  );
}
