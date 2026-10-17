'use client';

import { useTranslations } from 'next-intl';

import { OPTION_GROUPS } from '@/lib/pricing/price-list';

import { AddOnOption } from './AddOnOption';
import { ADD_ON_PRICES, PAGE_TIERS } from './constants';
import { OptionGroup } from './OptionGroup';
import type { AddOnKey, OptionGroupProps } from './PricingSimulator.types';
import { TieredOption } from './TieredOption';
import { TierSlider } from './TierSlider';

/** The add-ons of the group, in the order of `OPTION_GROUPS`, which the recap follows too. */
type SiteAddOn = Extract<(typeof OPTION_GROUPS.site)[number], AddOnKey>;
const SITE_ADD_ONS = OPTION_GROUPS.site.filter((id): id is SiteAddOn => id in ADD_ON_PRICES);

/**
 * "Your site": number of pages, then what the site does. News published by the studio are an option
 * only with "We take care of everything": "You stay in control" includes a news section.
 */
export function SiteOptions({ plan, actions, surcharge }: OptionGroupProps) {
  const t = useTranslations('pricing.builder');
  const pageTiers = PAGE_TIERS.map((tier, index) => ({
    label: t(`pages.tiers.${tier.key}`),
    price:
      index === PAGE_TIERS.length - 1 ? t('pages.or_more', { price: surcharge(tier.price) }) : surcharge(tier.price),
  }));

  return (
    <OptionGroup title={t('groups.site')}>
      <div className="border-line bg-surface rounded-xl border p-4">
        <TierSlider
          label={t('pages.label')}
          tiers={pageTiers}
          value={plan.pages}
          onChange={actions.setPages}
          info={{ label: t('info_label', { option: t('pages.label') }), text: t('pages.info') }}
        />
      </div>
      {SITE_ADD_ONS.map((id) => (
        <AddOnOption key={id} id={id} checked={plan.addOns[id]} onToggle={actions.toggleAddOn} surcharge={surcharge} />
      ))}
      {plan.formula === 'managed' && (
        <TieredOption
          id="news"
          value={plan.news}
          onToggle={actions.toggleTiered}
          onTierChange={actions.setTier}
          surcharge={surcharge}
        />
      )}
    </OptionGroup>
  );
}
