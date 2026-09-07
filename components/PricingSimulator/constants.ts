import type { AddOnKey, PlanSelection, TierIndex } from './PricingSimulator.types';

/** Monthly price of the entry plan: one page, hosting and security included. */
export const BASE_PRICE = 10;

/** Monthly surcharge per tickable add-on. */
export const ADD_ON_PRICES: Record<AddOnKey, number> = {
  domain: 5,
  swiss_hosting: 10,
  email: 10,
};

/** Order the add-ons are listed in. */
export const ADD_ON_KEYS: AddOnKey[] = ['domain', 'swiss_hosting', 'email'];

/** Monthly surcharge per position of the "number of pages" slider. */
export const PAGE_TIER_PRICES = [0, 5, 10, 20, 25] as const;

/** Translation keys naming each position of the "number of pages" slider. */
export const PAGE_TIER_KEYS = ['one', 'two_three', 'four_five', 'six_eight', 'nine_ten'] as const;

/** Monthly surcharge per position of the "content updates" slider. */
export const UPDATE_TIER_PRICES = [5, 15, 25, 50, 100] as const;

/** Translation keys naming each position of the "content updates" slider. */
export const UPDATE_TIER_KEYS = ['few_per_year', 'monthly', 'twice_monthly', 'weekly', 'unlimited'] as const;

/** Both sliders run from 0 to this index. */
export const MAX_TIER_INDEX = 4;

/** Top position of either slider — anything beyond it needs a personal quote. */
export const TIER_INDEXES: TierIndex[] = [0, 1, 2, 3, 4];

export const INITIAL_SELECTION: PlanSelection = {
  addOns: { domain: false, swiss_hosting: false, email: false },
  pages: 0,
  updatesEnabled: false,
  updates: 0,
};
