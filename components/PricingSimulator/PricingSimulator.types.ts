import type {
  ADD_ON_PRICES,
  ARTICLE_TIERS,
  NEWS_TIERS,
  PAGE_TIERS,
  REPORT_TIERS,
  SEO_TIERS,
  UPDATE_TIERS,
} from './constants';
import type { SimulatorActions } from './PricingSimulator.hooks';

export type ProjectType = 'website' | 'mobile' | 'both';

/** `showcase` opens the plan builder; every other type leads to a custom quote. */
export type WebsiteType = 'showcase' | 'self_managed' | 'accounts' | 'ecommerce';

/**
 * `managed`: the studio makes every change, sent by email ("We take care of everything").
 * `self_service`: the client publishes news and opening hours through an editing tool that comes
 * with the formula and cannot be removed from it ("You stay in control").
 */
export type Formula = 'managed' | 'self_service';

/**
 * Add-ons of the plan. `domain` follows the answer about an existing domain name, `email` only exists
 * with `domain`, `redirects` with `email`, `detailed_analytics` with analytics.
 */
export type AddOnKey = keyof typeof ADD_ON_PRICES;

/** Zero-based position in a fixed tier table, e.g. `0 | 1 | 2` for a three-tier table. */
export type TierIndexOf<T extends readonly unknown[]> = Exclude<Partial<T>['length'], T['length']>;

/** Keys of a tier table, e.g. `'quarterly' | 'monthly'`. */
export type TierKeyOf<T extends readonly { key: string }[]> = T[number]['key'];

type PageTier = TierIndexOf<typeof PAGE_TIERS>;
export type UpdateTier = TierIndexOf<typeof UPDATE_TIERS>;
type NewsTier = TierIndexOf<typeof NEWS_TIERS>;
type ReportTier = TierIndexOf<typeof REPORT_TIERS>;
type SeoTier = TierIndexOf<typeof SEO_TIERS>;
type ArticleTier = TierIndexOf<typeof ARTICLE_TIERS>;

/** Options made of a tick box and a slider: `null` while unticked. */
export type TieredKey = 'news' | 'analytics' | 'seo' | 'articles';

export interface PlanSelection {
  formula: Formula;
  /**
   * Answer to "Do you already have a domain name?": `false` makes the studio's domain management part
   * of the plan, `true` leaves the domain and email options out, `null` while unanswered.
   */
  ownDomain: boolean | null;
  addOns: Record<AddOnKey, boolean>;
  pages: PageTier;
  /** The update package is opt-in: its slider only counts once enabled (one change a year is included). */
  updatesEnabled: boolean;
  updates: UpdateTier;
  /** News published by the studio, by rhythm ("We take care of everything" only). */
  news: NewsTier | null;
  /** Visit statistics, by how often the written report is sent. */
  analytics: ReportTier | null;
  /** Local search follow-up, by rhythm. */
  seo: SeoTier | null;
  /** AI-assisted articles, by rhythm. */
  articles: ArticleTier | null;
  /** Extra mailboxes on top of the main email address, from 0 to `MAX_EXTRA_MAILBOXES`. */
  mailboxes: number;
}

/** One line of the recap and of the studio email, in display order. */
export interface PlanItem {
  id: 'formula' | 'pages' | 'updates' | 'mailboxes' | TieredKey | AddOnKey;
  amount: number;
  /** Tier key of a slider line, e.g. `five_seven` or `weekly`. */
  tier?: string;
  /** Number of extra mailboxes. */
  count?: number;
}

/** What every option group of the builder receives. */
export interface OptionGroupProps {
  plan: PlanSelection;
  actions: SimulatorActions;
  /** Formats a monthly surcharge, e.g. `+5 €`. */
  surcharge: (amount: number) => string;
}
