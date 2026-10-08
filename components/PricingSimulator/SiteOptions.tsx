'use client';

import { useTranslations } from 'next-intl';

import { AddOnOption } from './AddOnOption';
import { PAGE_TIERS } from './constants';
import { OptionGroup } from './OptionGroup';
import type { AddOnKey, OptionGroupProps } from './PricingSimulator.types';
import { TierSlider } from './TierSlider';

const SITE_ADD_ONS: readonly AddOnKey[] = ['contact_form', 'booking', 'reviews', 'english'];

/** "Your site": number of pages, then what the site does. The news section is an option only when the studio publishes. */
export function SiteOptions({ plan, actions, surcharge }: OptionGroupProps) {
  const t = useTranslations('pricing.builder');
  const pageTiers = PAGE_TIERS.map((tier, index) => ({
    label: t(`pages.tiers.${tier.key}`),
    price:
      index === PAGE_TIERS.length - 1 ? t('pages.or_more', { price: surcharge(tier.price) }) : surcharge(tier.price),
  }));
  const addOns: readonly AddOnKey[] = plan.formula === 'managed' ? [...SITE_ADD_ONS, 'news'] : SITE_ADD_ONS;

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
      {addOns.map((id) => (
        <AddOnOption
          key={id}
          id={id}
          // eslint-disable-next-line security/detect-object-injection -- id comes from a fixed list
          checked={plan.addOns[id]}
          onToggle={actions.toggleAddOn}
          surcharge={surcharge}
        />
      ))}
    </OptionGroup>
  );
}
