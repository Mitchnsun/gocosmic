import {
  ADD_ON_PRICES,
  COMMITTED_OPTIONS,
  EXTRA_MAILBOX_PRICE,
  FORMULA_PRICES,
  FORMULAS,
  PAGE_TIERS,
  TIERED_TABLES,
  UPDATE_TIERS,
} from '@/components/PricingSimulator/constants';
import type { AddOnKey, Formula, TieredKey } from '@/components/PricingSimulator/PricingSimulator.types';
import type { Region } from '@/lib/region';

/** Everything the simulator puts a price on, besides the plan itself. */
export type PricedOption = 'pages' | 'updates' | 'mailboxes' | TieredKey | AddOnKey;

/** Options folded under "More options" in the simulator, in display order; the others show at once. */
export const ADVANCED_OPTIONS = [
  'redirects',
  'seo',
  'analytics',
  'detailed_analytics',
  'articles',
  'swiss_hosting',
] as const satisfies readonly PricedOption[];

/**
 * The simulator's option groups and their options, in display order, which the recap follows too;
 * each group key names a `pricing.builder.groups` message. Every priced option belongs to exactly one
 * group.
 */
export const OPTION_GROUPS = {
  site: ['pages', 'contact_form', 'booking', 'reviews', 'english', 'news'],
  address: ['domain', 'email', 'mailboxes'],
  care: ['updates'],
  more: ADVANCED_OPTIONS,
} as const satisfies Record<string, readonly PricedOption[]>;

/** One monthly price of the subscription, net of VAT, charged as the same amount in euros and Swiss francs. */
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
  /** Turns the subscription into 12-month periods. */
  commitment: boolean;
  /** Only offered with this plan. */
  formula?: Formula;
  /** Only offered in this region. */
  region?: Region;
}

/** The prices of one option, as its row or slider in the simulator shows them. */
export function getOptionPrices(option: PricedOption): PriceLine[] {
  const base = { option, commitment: (COMMITTED_OPTIONS as ReadonlySet<string>).has(option) };

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
    case 'news':
    case 'analytics':
    case 'seo':
    case 'articles': {
      return TIERED_TABLES[option].map((tier) => ({
        ...base,
        labelKey: `options.${option}.label`,
        tierKey: `options.${option}.tiers.${tier.key}`,
        price: tier.price,
        // "You stay in control" already includes a news section, which the client publishes in.
        ...(option === 'news' && { formula: 'managed' as const }),
      }));
    }
    default: {
      return [
        {
          ...base,
          labelKey: `options.${option}.label`,
          price: ADD_ON_PRICES[option],
          // Swiss hosting is offered on the Swiss version only.
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
export const getPriceLineName = (t: (key: string) => string, line: PriceLine): string =>
  line.tierKey ? `${t(line.labelKey)} · ${t(line.tierKey)}` : t(line.labelKey);
