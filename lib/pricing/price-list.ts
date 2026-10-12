import {
  ADD_ON_PRICES,
  EXTRA_MAILBOX_PRICE,
  FORMULA_PRICES,
  FORMULAS,
  ONE_YEAR_OPTIONS,
  PAGE_TIERS,
  TIERED_TABLES,
  UPDATE_TIERS,
} from '@/components/PricingSimulator/constants';
import type { AddOnKey, Formula, TieredKey } from '@/components/PricingSimulator/PricingSimulator.types';
import type { Region } from '@/lib/region';

/** Everything the simulator puts a price on, besides the plan itself. */
export type PricedOption = 'pages' | 'updates' | 'mailboxes' | TieredKey | AddOnKey;

/**
 * The simulator's option groups and their options, in display order; each group key names a
 * `pricing.builder.groups` message. Every add-on belongs to exactly one group.
 */
export const OPTION_GROUPS = {
  site: ['pages', 'contact_form', 'booking', 'reviews', 'english', 'news'],
  address: ['domain', 'email', 'mailboxes', 'redirects', 'swiss_hosting'],
  visibility: ['seo', 'analytics', 'detailed_analytics'],
  care: ['updates', 'articles', 'monitoring'],
} as const satisfies Record<string, readonly PricedOption[]>;

/** One monthly price of the subscription, excl. VAT, charged as the same amount in euros and Swiss francs. */
export interface PriceLine {
  /** The plan, or the option the price belongs to. */
  option: PricedOption | 'formula';
  /** Key of the line's name, under `pricing.builder`. */
  labelKey: string;
  /** Key of the slider step, under `pricing.builder`, for an option priced by tier. */
  tierKey?: string;
  price: number;
  /** The last step of a slider: the price is a minimum. */
  orMore?: boolean;
  /** Subscribed for 12-month periods. */
  commitment: boolean;
  /** Only offered with this plan. */
  formula?: Formula;
  /** Only offered in this region. */
  region?: Region;
}

/** The prices of one option, as its row or slider in the simulator shows them. */
export function getOptionPrices(option: PricedOption): PriceLine[] {
  const base = { option, commitment: (ONE_YEAR_OPTIONS as ReadonlySet<string>).has(option) };

  switch (option) {
    case 'pages': {
      // The first step, the homepage, comes with every plan.
      const paid = PAGE_TIERS.slice(1);
      return paid.map((tier, index) => ({
        ...base,
        labelKey: 'pages.label',
        tierKey: `pages.tiers.${tier.key}`,
        price: tier.price,
        ...(index === paid.length - 1 && { orMore: true }),
      }));
    }
    case 'updates': {
      return UPDATE_TIERS.map((tier) => ({
        ...base,
        labelKey: 'updates.label',
        tierKey: `updates.tiers.${tier.key}`,
        price: tier.price,
      }));
    }
    case 'mailboxes': {
      return [{ ...base, labelKey: 'options.mailboxes.label', price: EXTRA_MAILBOX_PRICE }];
    }
    case 'analytics':
    case 'seo':
    case 'articles': {
      return TIERED_TABLES[option].map((tier) => ({
        ...base,
        labelKey: `options.${option}.label`,
        tierKey: `options.${option}.tiers.${tier.key}`,
        price: tier.price,
      }));
    }
    default: {
      return [
        {
          ...base,
          labelKey: `options.${option}.label`,
          price: ADD_ON_PRICES[option],
          // "You stay in control" already includes a news section; Swiss hosting is offered on the Swiss version only.
          ...(option === 'news' && { formula: 'managed' as const }),
          ...(option === 'swiss_hosting' && { region: 'ch' as const }),
        },
      ];
    }
  }
}

/** Every price of the subscription: the plans, then each option in display order. */
export function getPriceLines(region?: Region): PriceLine[] {
  const plans: PriceLine[] = FORMULAS.map((formula) => ({
    option: 'formula',
    labelKey: `formulas.${formula}.label`,
    price: FORMULA_PRICES[formula],
    // The editing tool of "You stay in control" is set up for 12-month periods.
    commitment: formula === 'self_service',
  }));
  const options = Object.values(OPTION_GROUPS).flatMap((group) => group.flatMap(getOptionPrices));

  return [...plans, ...options].filter((line) => !region || !line.region || line.region === region);
}

/** Name of a price line, e.g. "Visit statistics · Every three months". */
export function getPriceLineName(t: (key: string) => string, line: PriceLine): string {
  return line.tierKey ? `${t(line.labelKey)} · ${t(line.tierKey)}` : t(line.labelKey);
}
