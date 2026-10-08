'use client';

import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { AddOnOption } from './AddOnOption';
import { UPDATE_TIERS } from './constants';
import { OptionGroup } from './OptionGroup';
import { OptionToggle } from './OptionToggle';
import type { OptionGroupProps } from './PricingSimulator.types';
import { TieredOption } from './TieredOption';
import { TierSlider } from './TierSlider';

/**
 * "Updates and follow-up": content changes made by the studio, AI-assisted articles right below
 * (each one counts as a change, so they can lift and lock the update package), then monitoring.
 */
export function CareOptions({
  plan,
  actions,
  surcharge,
  updatesRaised,
}: OptionGroupProps & { updatesRaised: boolean }) {
  const t = useTranslations('pricing.builder');
  const noteId = useId();
  // Articles lock the package: say why, and whether its rhythm had to be raised.
  const articlesNote =
    plan.articles === null ? undefined : t(updatesRaised ? 'options.articles.raised' : 'options.articles.locked');
  const updateTiers = UPDATE_TIERS.map((tier) => ({
    label: t(`updates.tiers.${tier.key}`),
    price: surcharge(tier.price),
  }));

  return (
    <OptionGroup title={t('groups.care')}>
      <OptionToggle
        label={t('updates.label')}
        hint={t(plan.formula === 'self_service' ? 'updates.hint_self_service' : 'updates.hint')}
        price={plan.updatesEnabled ? surcharge(UPDATE_TIERS[plan.updates].price) : t('updates.off')}
        checked={plan.updatesEnabled}
        onChange={actions.toggleUpdates}
        disabled={plan.articles !== null}
        note={articlesNote}
        noteId={noteId}>
        <div className="border-line border-t px-4 py-4">
          <TierSlider
            label={t('updates.slider_label')}
            tiers={updateTiers}
            value={plan.updates}
            onChange={actions.setUpdates}
            disabled={!plan.updatesEnabled}
            describedBy={articlesNote ? noteId : undefined}
          />
        </div>
      </OptionToggle>
      <TieredOption
        id="articles"
        value={plan.articles}
        onToggle={actions.toggleTiered}
        onTierChange={actions.setTier}
        surcharge={surcharge}
        extraInfo={plan.formula === 'self_service' ? t('options.articles.info_tool') : undefined}
      />
      <AddOnOption
        id="monitoring"
        checked={plan.addOns.monitoring}
        onToggle={actions.toggleAddOn}
        surcharge={surcharge}
      />
    </OptionGroup>
  );
}
