'use client';

import { useTranslations } from 'next-intl';

import type { Region } from '@/lib/region';

import { AddOnOption } from './AddOnOption';
import { EmailExtras } from './EmailExtras';
import { OptionGroup } from './OptionGroup';
import type { OptionGroupProps } from './PricingSimulator.types';

/** "Your address on the web": domain, email address (with its extras) and, for Swiss visitors only, Swiss hosting. */
export function AddressOptions({
  plan,
  actions,
  surcharge,
  domain,
  region,
}: OptionGroupProps & { domain: string; region: Region }) {
  const t = useTranslations('pricing.builder');
  const common = { onToggle: actions.toggleAddOn, surcharge, values: { domain } };

  return (
    <OptionGroup title={t('groups.address')}>
      <AddOnOption id="domain" checked={plan.addOns.domain} {...common} />
      <AddOnOption
        id="email"
        checked={plan.addOns.email}
        note={plan.addOns.email ? t('options.email.note') : undefined}
        {...common}>
        {plan.addOns.email && <EmailExtras plan={plan} actions={actions} surcharge={surcharge} domain={domain} />}
      </AddOnOption>
      {region === 'ch' && <AddOnOption id="swiss_hosting" checked={plan.addOns.swiss_hosting} {...common} />}
    </OptionGroup>
  );
}
