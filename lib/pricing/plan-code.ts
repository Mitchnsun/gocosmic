import { ADD_ON_KEYS, TIER_INDEXES } from '@/components/PricingSimulator/constants';
import type {
  AddOnKey,
  PlanSelection,
  ProjectType,
  TierIndex,
  WebsiteType,
} from '@/components/PricingSimulator/PricingSimulator.types';
import type { Region } from '@/lib/region';

const PROJECT_TYPES: readonly ProjectType[] = ['website', 'mobile', 'both'];
const WEBSITE_TYPES: readonly WebsiteType[] = ['showcase', 'self_managed', 'accounts', 'ecommerce'];
const REGIONS: readonly Region[] = ['fr', 'ch'];

/** Placeholder for a segment that has no value (no website type, no add-on…). */
const NONE = '-';

/** A pricing simulation, as it travels from the pricing page to the studio. */
export interface DecodedPlan {
  projectType: ProjectType;
  websiteType: WebsiteType | null;
  selection: PlanSelection;
  region: Region;
}

const isOneOf = <T extends string>(list: readonly T[], value: string): value is T => list.includes(value as T);

const toTier = (digit: string): TierIndex | null => {
  const index = Number(digit);
  return TIER_INDEXES.find((tier) => tier === index) ?? null;
};

/**
 * Serialises a simulation into a short URL-safe code, e.g.
 * `website~showcase~p2~u3~domain.email~fr`.
 *
 * Only what the visitor chose is encoded: prices are never part of the code, the
 * receiving side recomputes them from the price table.
 */
export function encodePlanCode({ projectType, websiteType, selection, region }: DecodedPlan): string {
  // eslint-disable-next-line security/detect-object-injection -- keys come from ADD_ON_KEYS
  const addOns = ADD_ON_KEYS.filter((key) => selection.addOns[key]);

  return [
    projectType,
    websiteType ?? NONE,
    `p${selection.pages}`,
    selection.updatesEnabled ? `u${selection.updates}` : `u${NONE}`,
    addOns.length > 0 ? addOns.join('.') : NONE,
    region,
  ].join('~');
}

/**
 * Parses a code produced by {@link encodePlanCode}. The input is untrusted (it
 * comes from a URL or a form field): anything that is not exactly a valid code
 * yields `null`.
 */
export function decodePlanCode(raw: unknown): DecodedPlan | null {
  if (typeof raw !== 'string' || raw.length > 120) return null;

  const segments = raw.split('~');
  if (segments.length !== 6) return null;
  const [projectType, websiteSegment, pages, updates, addOnSegment, region] = segments as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];

  if (!isOneOf(PROJECT_TYPES, projectType) || !isOneOf(REGIONS, region)) return null;

  let websiteType: WebsiteType | null = null;
  if (websiteSegment !== NONE) {
    if (!isOneOf(WEBSITE_TYPES, websiteSegment)) return null;
    websiteType = websiteSegment;
  }

  if (!/^p\d$/.test(pages) || !/^u(\d|-)$/.test(updates)) return null;
  const pageTier = toTier(pages.slice(1));
  if (pageTier === null) return null;

  const updatesEnabled = updates !== `u${NONE}`;
  const updateTier = updatesEnabled ? toTier(updates.slice(1)) : 0;
  if (updateTier === null) return null;

  const addOns: Record<AddOnKey, boolean> = { domain: false, swiss_hosting: false, email: false };
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
    selection: { addOns, pages: pageTier, updatesEnabled, updates: updateTier },
    region,
  };

  // Only canonical codes are accepted (no duplicate or reordered add-ons).
  return encodePlanCode(plan) === raw ? plan : null;
}
