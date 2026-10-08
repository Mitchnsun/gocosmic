import type { AddOnKey, Formula, PlanSelection, TieredKey } from './PricingSimulator.types';

/** Monthly price of the entry plan: one page, hosting and security included. Quoted as "from" across the site. */
export const BASE_PRICE = 10;

/** Formulas, in tab order. */
export const FORMULAS: readonly Formula[] = ['managed', 'self_service'];

/** Monthly price of each formula. "You stay in control" includes the editing tool and the news section. */
export const FORMULA_PRICES: Record<Formula, number> = { managed: BASE_PRICE, self_service: 20 };

/** Monthly surcharge per tickable add-on. */
export const ADD_ON_PRICES: Record<AddOnKey, number> = {
  domain: 5,
  swiss_hosting: 10,
  email: 15,
  contact_form: 5,
  booking: 5,
  reviews: 5,
  english: 5,
  news: 5,
  monitoring: 5,
  detailed_analytics: 5,
  redirects: 5,
};

/** Canonical order of the add-ons, used by the plan code. */
export const ADD_ON_KEYS: readonly AddOnKey[] = [
  'domain',
  'swiss_hosting',
  'email',
  'contact_form',
  'booking',
  'reviews',
  'english',
  'news',
  'monitoring',
  'detailed_analytics',
  'redirects',
];

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

/** AI-assisted articles. Each one counts as a content change, hence the lowest update tier it needs. */
export const ARTICLE_TIERS = [
  { key: 'monthly', price: 5, minUpdates: 'monthly' },
  { key: 'weekly', price: 15, minUpdates: 'weekly' },
  { key: 'daily', price: 50, minUpdates: 'unlimited' },
] as const;

/** Tier table of each tick box + slider option. */
export const TIERED_TABLES = { analytics: REPORT_TIERS, seo: SEO_TIERS, articles: ARTICLE_TIERS } as const;

/** Extra mailboxes on top of the main address; beyond the maximum, it is quoted personally. */
export const EXTRA_MAILBOX_PRICE = 10;
export const MAX_EXTRA_MAILBOXES = 5;

/** Options subscribed for 12-month periods, flagged with a one-year commitment in the simulator. */
export const ONE_YEAR_OPTIONS: ReadonlySet<AddOnKey | TieredKey | 'mailboxes'> = new Set([
  'news',
  'english',
  'redirects',
  'mailboxes',
  'analytics',
  'seo',
  'articles',
]);

export const INITIAL_SELECTION: PlanSelection = {
  formula: 'managed',
  addOns: {
    domain: false,
    swiss_hosting: false,
    email: false,
    contact_form: false,
    booking: false,
    reviews: false,
    english: false,
    news: false,
    monitoring: false,
    detailed_analytics: false,
    redirects: false,
  },
  pages: 0,
  updatesEnabled: false,
  updates: 0,
  analytics: null,
  seo: null,
  articles: null,
  mailboxes: 0,
};
