'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { useId, useState } from 'react';

import { cn } from '@/design-system/lib/utils';
import type { Region } from '@/lib/region';

import { AddOnOption } from './AddOnOption';
import type { Cascade } from './PricingSimulator.rules';
import type { OptionGroupProps } from './PricingSimulator.types';
import { countAdvancedOptions } from './PricingSimulator.utils';
import { TieredOption } from './TieredOption';

interface MoreOptionsProps extends OptionGroupProps {
  domain: string;
  region: Region;
  cascade: Cascade | null;
}

/**
 * "More options": the options for precise needs, folded so the visitor first sees the common ones
 * (`ADVANCED_OPTIONS`). The button says how many of them are ticked, and the recap keeps listing them
 * when it is closed.
 */
export function MoreOptions({ plan, actions, surcharge, domain, region, cascade }: MoreOptionsProps) {
  const t = useTranslations('pricing.builder');
  const panelId = useId();
  const ticked = countAdvancedOptions(plan);
  const [open, setOpen] = useState(false);
  const tiered = { onToggle: actions.toggleTiered, onTierChange: actions.setTier, surcharge };

  return (
    <div className="border-line border-t pt-4">
      <h4>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(!open)}
          className="font-display text-fg focus-visible:ring-aerospace-ink flex min-h-11 w-full cursor-pointer items-center justify-between gap-4 rounded-lg text-left text-base font-semibold focus-visible:ring-2 focus-visible:outline-none">
          <span className="flex flex-wrap items-baseline gap-x-3">
            {t('groups.more')}
            {ticked > 0 && (
              <span className="text-aerospace-ink text-sm font-normal">{t('more.count', { count: ticked })}</span>
            )}
          </span>
          <ChevronDownIcon
            aria-hidden="true"
            className={cn('text-fg-2 size-5 shrink-0 transition-transform motion-reduce:transition-none', {
              'rotate-180': open,
            })}
          />
        </button>
      </h4>
      <div id={panelId} hidden={!open} className="mt-3 space-y-3">
        <p className="text-fg-2 text-sm">{t(`more.intro.${region}`)}</p>
        {plan.addOns.email && (
          <AddOnOption
            id="redirects"
            checked={plan.addOns.redirects}
            onToggle={actions.toggleAddOn}
            surcharge={surcharge}
            values={{ domain }}
          />
        )}
        <TieredOption id="seo" value={plan.seo} {...tiered} />
        <TieredOption
          id="analytics"
          value={plan.analytics}
          {...tiered}
          note={cascade === 'detailed_analytics' ? t('cascades.detailed_analytics') : undefined}>
          <AddOnOption
            id="detailed_analytics"
            checked={plan.addOns.detailed_analytics}
            onToggle={actions.toggleAddOn}
            surcharge={surcharge}
            nested
          />
        </TieredOption>
        <TieredOption
          id="articles"
          value={plan.articles}
          {...tiered}
          extraInfo={plan.formula === 'self_service' ? t('options.articles.info_tool') : undefined}
        />
        {region === 'ch' && (
          <AddOnOption
            id="swiss_hosting"
            checked={plan.addOns.swiss_hosting}
            onToggle={actions.toggleAddOn}
            surcharge={surcharge}
          />
        )}
      </div>
    </div>
  );
}
