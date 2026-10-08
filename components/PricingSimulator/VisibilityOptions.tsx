'use client';

import { useTranslations } from 'next-intl';

import { AddOnOption } from './AddOnOption';
import { OptionGroup } from './OptionGroup';
import type { OptionGroupProps } from './PricingSimulator.types';
import { TieredOption } from './TieredOption';

/** "Get found and count your visits": local search follow-up, then statistics with their detailed measurement. */
export function VisibilityOptions({ plan, actions, surcharge }: OptionGroupProps) {
  const t = useTranslations('pricing.builder');
  const common = { onToggle: actions.toggleTiered, onTierChange: actions.setTier, surcharge };

  return (
    <OptionGroup title={t('groups.visibility')}>
      <TieredOption id="seo" value={plan.seo} {...common} />
      <TieredOption id="analytics" value={plan.analytics} {...common}>
        <AddOnOption
          id="detailed_analytics"
          checked={plan.addOns.detailed_analytics}
          onToggle={actions.toggleAddOn}
          surcharge={surcharge}
          nested
        />
      </TieredOption>
    </OptionGroup>
  );
}
