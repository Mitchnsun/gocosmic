import type { Currency } from '@/lib/region';

import { ADD_ON_PRICES, BASE_PRICE, MAX_TIER_INDEX, PAGE_TIER_PRICES, UPDATE_TIER_PRICES } from './constants';
import type { AddOnKey, PlanSelection, TierIndex } from './PricingSimulator.types';

/** Clamp any number coming from a range input onto a valid slider position. */
export function toTierIndex(value: number): TierIndex {
  const rounded = Math.round(value);
  if (Number.isNaN(rounded) || rounded < 0) return 0;
  if (rounded > MAX_TIER_INDEX) return MAX_TIER_INDEX;
  return rounded as TierIndex;
}

// The indexes below are narrow unions (`TierIndex`, `AddOnKey`), never free-form input.
export function getPageTierPrice(tier: TierIndex): number {
  // eslint-disable-next-line security/detect-object-injection
  return PAGE_TIER_PRICES[tier];
}

export function getUpdateTierPrice(tier: TierIndex): number {
  // eslint-disable-next-line security/detect-object-injection
  return UPDATE_TIER_PRICES[tier];
}

export function getAddOnPrice(key: AddOnKey): number {
  // eslint-disable-next-line security/detect-object-injection
  return ADD_ON_PRICES[key];
}

/** Monthly total of a composed plan: base + ticked add-ons + both sliders. */
export function getMonthlyTotal(selection: PlanSelection): number {
  const addOns = (Object.keys(ADD_ON_PRICES) as AddOnKey[]).reduce(
    // eslint-disable-next-line security/detect-object-injection
    (sum, key) => (selection.addOns[key] ? sum + getAddOnPrice(key) : sum),
    0
  );
  const updates = selection.updatesEnabled ? getUpdateTierPrice(selection.updates) : 0;

  return BASE_PRICE + addOns + getPageTierPrice(selection.pages) + updates;
}

/**
 * True once a slider sits on its top position: the plan still has a price, but
 * anything larger has to be quoted personally.
 */
export function needsCustomQuote(selection: PlanSelection): boolean {
  return selection.pages === MAX_TIER_INDEX || (selection.updatesEnabled && selection.updates === MAX_TIER_INDEX);
}

/** Amounts are identical in both currencies — only the symbol changes. */
export function formatAmount(amount: number, currency: Currency): string {
  return currency === 'chf' ? `${amount} CHF` : `${amount}€`;
}
