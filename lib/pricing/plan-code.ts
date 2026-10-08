import {
  ADD_ON_KEYS,
  FORMULAS,
  INITIAL_SELECTION,
  MAX_EXTRA_MAILBOXES,
  PAGE_TIERS,
  TIERED_TABLES,
  UPDATE_TIERS,
} from '@/components/PricingSimulator/constants';
import { isAddOnOffered, normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import type {
  AddOnKey,
  PlanSelection,
  ProjectType,
  TierIndexOf,
  WebsiteType,
} from '@/components/PricingSimulator/PricingSimulator.types';
import type { Region } from '@/lib/region';

const PROJECT_TYPES: readonly ProjectType[] = ['website', 'mobile', 'both'];
const WEBSITE_TYPES: readonly WebsiteType[] = ['showcase', 'self_managed', 'accounts', 'ecommerce'];
const REGIONS: readonly Region[] = ['fr', 'ch'];

/** Placeholder for a segment that has no value (no website type, unticked option…). */
const NONE = '-';

/** Longest valid code is about 160 characters (every add-on ticked). */
const MAX_LENGTH = 200;

/** A pricing simulation, as it travels from the pricing page to the studio. */
export interface DecodedPlan {
  projectType: ProjectType;
  websiteType: WebsiteType | null;
  selection: PlanSelection;
  region: Region;
}

const isOneOf = <T extends string>(list: readonly T[], value: string): value is T => list.includes(value as T);

/** `p2` → 2 for a segment of the given prefix; `-` → `null` when allowed; anything else → `undefined`. */
function readDigit(segment: string, prefix: string, length: number, optional: boolean): number | null | undefined {
  if (segment.length !== prefix.length + 1 || !segment.startsWith(prefix)) return undefined;
  const value = segment.slice(prefix.length);
  if (value === NONE) return optional ? null : undefined;
  if (!/^\d$/.test(value)) return undefined;
  return Number(value) < length ? Number(value) : undefined;
}

const tierSegment = (prefix: string, value: number | null) => `${prefix}${value ?? NONE}`;

/**
 * Serialises a simulation into a short URL-safe code, e.g.
 * `website~showcase~managed~p2~u3~a1~s-~r-~m0~domain.email~fr`:
 * formula, pages, content updates, statistics report, local search, articles, extra mailboxes,
 * ticked add-ons, region. The plan is normalised first, and add-ons not offered in its region are
 * dropped, so the code always follows the rules.
 *
 * Only what the visitor chose is encoded: prices are never part of the code, the
 * receiving side recomputes them from the price table.
 */
export function encodePlanCode({ projectType, websiteType, selection, region }: DecodedPlan): string {
  const plan = normalizePlan(selection);
  // eslint-disable-next-line security/detect-object-injection -- keys come from ADD_ON_KEYS
  const addOns = ADD_ON_KEYS.filter((key) => plan.addOns[key] && isAddOnOffered(key, region));

  return [
    projectType,
    websiteType ?? NONE,
    plan.formula,
    `p${plan.pages}`,
    tierSegment('u', plan.updatesEnabled ? plan.updates : null),
    tierSegment('a', plan.analytics),
    tierSegment('s', plan.seo),
    tierSegment('r', plan.articles),
    `m${plan.mailboxes}`,
    addOns.length > 0 ? addOns.join('.') : NONE,
    region,
  ].join('~');
}

/**
 * Parses a code produced by {@link encodePlanCode}. The input is untrusted (it comes from a form
 * field): anything that is not exactly a valid, canonical code — including one that breaks a rule,
 * such as an email address without its domain — yields `null`.
 */
export function decodePlanCode(raw: unknown): DecodedPlan | null {
  if (typeof raw !== 'string' || raw.length > MAX_LENGTH) return null;

  const segments = raw.split('~');
  if (segments.length !== 11) return null;
  const [
    projectType,
    websiteSegment,
    formula,
    pages,
    updates,
    analytics,
    seo,
    articles,
    mailboxes,
    addOnSegment,
    region,
  ] = segments as [string, string, string, string, string, string, string, string, string, string, string];

  if (!isOneOf(PROJECT_TYPES, projectType) || !isOneOf(REGIONS, region) || !isOneOf(FORMULAS, formula)) return null;

  let websiteType: WebsiteType | null = null;
  if (websiteSegment !== NONE) {
    if (!isOneOf(WEBSITE_TYPES, websiteSegment)) return null;
    websiteType = websiteSegment;
  }

  const digits = [
    readDigit(pages, 'p', PAGE_TIERS.length, false),
    readDigit(updates, 'u', UPDATE_TIERS.length, true),
    readDigit(analytics, 'a', TIERED_TABLES.analytics.length, true),
    readDigit(seo, 's', TIERED_TABLES.seo.length, true),
    readDigit(articles, 'r', TIERED_TABLES.articles.length, true),
    readDigit(mailboxes, 'm', MAX_EXTRA_MAILBOXES + 1, false),
  ];
  if (digits.includes(undefined)) return null;
  const [pageTier, updateTier, reportTier, seoTier, articleTier, mailboxCount] = digits as (number | null)[];

  const addOns: Record<AddOnKey, boolean> = { ...INITIAL_SELECTION.addOns };
  if (addOnSegment !== NONE) {
    for (const key of addOnSegment.split('.')) {
      if (!isOneOf(ADD_ON_KEYS, key)) return null;
      // eslint-disable-next-line security/detect-object-injection -- key was validated against ADD_ON_KEYS
      addOns[key] = true;
    }
  }

  const plan: DecodedPlan = {
    projectType,
    websiteType,
    selection: {
      formula,
      addOns,
      pages: (pageTier ?? 0) as TierIndexOf<typeof PAGE_TIERS>,
      updatesEnabled: updateTier !== null,
      updates: (updateTier ?? 0) as TierIndexOf<typeof UPDATE_TIERS>,
      analytics: reportTier as TierIndexOf<typeof TIERED_TABLES.analytics> | null,
      seo: seoTier as TierIndexOf<typeof TIERED_TABLES.seo> | null,
      articles: articleTier as TierIndexOf<typeof TIERED_TABLES.articles> | null,
      mailboxes: mailboxCount ?? 0,
    },
    region,
  };

  // Only canonical codes are accepted: no duplicate or reordered add-on, no broken rule.
  return encodePlanCode(plan) === raw ? plan : null;
}
