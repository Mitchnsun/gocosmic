import type { ARTICLE_TIERS, PAGE_TIERS, REPORT_TIERS, SEO_TIERS, UPDATE_TIERS } from './constants';
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

/** Add-ons the visitor ticks. `redirects` only exists with `email`, `detailed_analytics` with analytics. */
export type AddOnKey =
  | 'domain'
  | 'swiss_hosting'
  | 'email'
  | 'contact_form'
  | 'booking'
  | 'reviews'
  | 'english'
  | 'news'
  | 'monitoring'
  | 'detailed_analytics'
  | 'redirects';

/** Zero-based position in a fixed tier table, e.g. `0 | 1 | 2` for a three-tier table. */
export type TierIndexOf<T extends readonly unknown[]> = Exclude<Partial<T>['length'], T['length']>;

type PageTier = TierIndexOf<typeof PAGE_TIERS>;
export type UpdateTier = TierIndexOf<typeof UPDATE_TIERS>;
type ReportTier = TierIndexOf<typeof REPORT_TIERS>;
type SeoTier = TierIndexOf<typeof SEO_TIERS>;
export type ArticleTier = TierIndexOf<typeof ARTICLE_TIERS>;

/** Options made of a tick box and a slider: `null` while unticked. */
export type TieredKey = 'analytics' | 'seo' | 'articles';

export interface PlanSelection {
  formula: Formula;
  addOns: Record<AddOnKey, boolean>;
  pages: PageTier;
  /** The update package is opt-in: its slider only counts once enabled (one change a year is included). */
  updatesEnabled: boolean;
  updates: UpdateTier;
  /** Visit statistics, by how often the written report is sent. */
  analytics: ReportTier | null;
  /** Local search follow-up, by rhythm. */
  seo: SeoTier | null;
  /** AI-assisted articles, by rhythm; each one counts as a content change. */
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
