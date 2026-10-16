import type { AddOnKey, Formula, PlanSelection, TieredKey } from './PricingSimulator.types';

/** Monthly price of the entry plan: one page, hosting and security included. Quoted as "from" across the site. */
export const BASE_PRICE = 10;

/** Formulas, in tab order. */
export const FORMULAS: readonly Formula[] = ['managed', 'self_service'];

/** Monthly price of each formula. "You stay in control" includes the editing tool and the news section. */
export const FORMULA_PRICES: Record<Formula, number> = { managed: BASE_PRICE, self_service: 20 };

/** What a formula includes, in display order; each key names a `pricing.builder.base.includes` message. */
export type IncludedItem =
  | 'page'
  | 'hosting'
  | 'security'
  | 'search_setup'
  | 'legal'
  | 'email_button'
  | 'yearly_update'
  | 'editor'
  | 'news';

const SHARED_INCLUDES: readonly IncludedItem[] = [
  'page',
  'hosting',
  'security',
  'search_setup',
  'legal',
  'email_button',
  'yearly_update',
];

/** What each formula includes; "You stay in control" adds its editing tool and news section. */
export const FORMULA_INCLUDES: Record<Formula, readonly IncludedItem[]> = {
  managed: SHARED_INCLUDES,
  self_service: [...SHARED_INCLUDES, 'editor', 'news'],
};

/**
 * Monthly surcharge per add-on. The row order is the canonical order of the plan code: append, never
 * reorder, unless the code changes version (`PLAN_CODE_VERSION`). The domain is never ticked by the
 * visitor: it follows their answer to "Do you already have a domain name?".
 */
export const ADD_ON_PRICES = {
  domain: 5,
  swiss_hosting: 10,
  email: 15,
  contact_form: 5,
  booking: 5,
  reviews: 5,
  english: 5,
  detailed_analytics: 5,
  redirects: 5,
} as const satisfies Record<string, number>;

/** Canonical order of the add-ons, used by the plan code. */
export const ADD_ON_KEYS: readonly AddOnKey[] = Object.keys(ADD_ON_PRICES) as AddOnKey[];

/** "Number of pages" slider. */
export const PAGE_TIERS = [
  { key: 'one', price: 0 },
  { key: 'two_four', price: 5 },
  { key: 'five_seven', price: 15 },
  { key: 'eight_nine', price: 25 },
  { key: 'ten_plus', price: 40 },
] as const;

/** "Content updates" slider, once the package is ticked (one change a year is included without it). */
export const UPDATE_TIERS = [
  { key: 'few_per_year', price: 5 },
  { key: 'monthly', price: 20 },
  { key: 'twice_monthly', price: 30 },
  { key: 'weekly', price: 60 },
  { key: 'unlimited', price: 200 },
] as const;

/** Visit statistics, by how often the written report is sent. */
export const REPORT_TIERS = [
  { key: 'yearly', price: 5 },
  { key: 'quarterly', price: 15 },
  { key: 'monthly', price: 50 },
] as const;

/** Local search follow-up: same work, different rhythm. */
export const SEO_TIERS = [
  { key: 'quarterly', price: 5 },
  { key: 'monthly', price: 15 },
] as const;

/** News published by the studio ("We take care of everything" only), by rhythm. They are not content changes. */
export const NEWS_TIERS = [
  { key: 'quarterly', price: 10 },
  { key: 'monthly', price: 25 },
  { key: 'weekly', price: 100 },
] as const;

/** AI-assisted articles, by rhythm, published in a section of their own. They are not content changes. */
export const ARTICLE_TIERS = [
  { key: 'quarterly', price: 10 },
  { key: 'monthly', price: 25 },
  { key: 'weekly', price: 100 },
  { key: 'thrice_weekly', price: 250 },
] as const;

/** Tier table of each tick box + slider option. */
export const TIERED_TABLES = {
  news: NEWS_TIERS,
  analytics: REPORT_TIERS,
  seo: SEO_TIERS,
  articles: ARTICLE_TIERS,
} as const;

/** Extra mailboxes on top of the main address; beyond the maximum, it is quoted personally. */
export const EXTRA_MAILBOX_PRICE = 10;
export const MAX_EXTRA_MAILBOXES = 5;

/**
 * Options subscribed for 12-month periods that can be removed at the end of a period: the options
 * marked "1-year commitment" in the terms of sale.
 */
export const ONE_YEAR_OPTIONS: ReadonlySet<AddOnKey | TieredKey | 'mailboxes'> = new Set([
  'news',
  'english',
  'redirects',
  'mailboxes',
  'analytics',
  'detailed_analytics',
  'seo',
  'articles',
]);

/**
 * Options that turn the whole subscription into 12-month periods (terms of sale, "Duration and
 * commitment"), flagged with the "1-year commitment" badge: the one-year options, plus the domain
 * name and the email address, which stay in the subscription once activated.
 */
export const COMMITTED_OPTIONS: ReadonlySet<AddOnKey | TieredKey | 'mailboxes'> = new Set([
  ...ONE_YEAR_OPTIONS,
  'domain',
  'email',
]);

export const INITIAL_SELECTION: PlanSelection = {
  formula: 'managed',
  ownDomain: null,
  addOns: Object.fromEntries(ADD_ON_KEYS.map((key) => [key, false])) as Record<AddOnKey, boolean>,
  pages: 0,
  updatesEnabled: false,
  updates: 0,
  news: null,
  analytics: null,
  seo: null,
  articles: null,
  mailboxes: 0,
};
