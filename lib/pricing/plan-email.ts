import { ADD_ON_KEYS, BASE_PRICE, PAGE_TIER_PRICES, UPDATE_TIER_PRICES } from '@/components/PricingSimulator/constants';
import type {
  AddOnKey,
  ProjectType,
  TierIndex,
  WebsiteType,
} from '@/components/PricingSimulator/PricingSimulator.types';
import {
  formatAmount,
  getAddOnPrice,
  getMonthlyTotal,
  needsCustomQuote,
} from '@/components/PricingSimulator/PricingSimulator.utils';
import type { DecodedPlan } from '@/lib/pricing/plan-code';
import { getCurrency } from '@/lib/region';

/*
 * Labels are kept in one fixed language on purpose: the email is read by the
 * studio, not by the visitor, and a server-side map cannot be spoofed by a
 * crafted payload (same reasoning as the palette labels of the mockup email).
 */
const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  website: 'A website',
  mobile: 'A mobile app',
  both: 'Both',
};

const WEBSITE_TYPE_LABELS: Record<WebsiteType, string> = {
  showcase: 'Showcase site presenting the business',
  self_managed: 'Site the visitor wants to edit themselves',
  accounts: 'Site with a customer area',
  ecommerce: 'Online shop',
};

const ADD_ON_LABELS: Record<AddOnKey, string> = {
  domain: 'Domain name management',
  swiss_hosting: 'Hosting in Switzerland',
  email: 'Email address on the domain',
};

const PAGE_TIER_LABELS: Record<TierIndex, string> = {
  0: '1 page (included)',
  1: '2 to 4 pages',
  2: '5 to 7 pages',
  3: '8 to 9 pages',
  4: '10 pages or more',
};

const UPDATE_TIER_LABELS: Record<TierIndex, string> = {
  0: '2 to 3 times a year',
  1: 'Once a month',
  2: 'Twice a month',
  3: 'Once a week',
  4: 'As often as needed',
};

const LABEL_PREFIX = 'Simulation';

/**
 * Turns a decoded pricing simulation into `[label, value]` rows for the studio
 * email. The monthly total is recomputed from the price table: the figure the
 * visitor saw is never transmitted, so it cannot be forged.
 */
export function buildPlanEmailRows(plan: DecodedPlan): Array<[string, string]> {
  const { projectType, websiteType, selection, region } = plan;
  const currency = getCurrency(region);
  const money = (amount: number) => formatAmount(amount, currency);

  /* eslint-disable security/detect-object-injection -- every index is a validated union or tier */
  const rows: Array<[string, string]> = [[`${LABEL_PREFIX} — project`, PROJECT_TYPE_LABELS[projectType]]];

  if (websiteType) {
    rows.push([`${LABEL_PREFIX} — site type`, WEBSITE_TYPE_LABELS[websiteType]]);
  }

  // Only a showcase site is priced; every other path is quoted personally.
  if (projectType !== 'website' || websiteType !== 'showcase') {
    rows.push([`${LABEL_PREFIX} — pricing`, 'Custom quote (no figure shown to the visitor)']);
    return rows;
  }

  const addOns = ADD_ON_KEYS.filter((key) => selection.addOns[key]).map(
    (key) => `${ADD_ON_LABELS[key]} (+${money(getAddOnPrice(key))})`
  );

  rows.push(
    [`${LABEL_PREFIX} — base plan`, `${money(BASE_PRICE)} / month`],
    [`${LABEL_PREFIX} — pages`, `${PAGE_TIER_LABELS[selection.pages]} (+${money(PAGE_TIER_PRICES[selection.pages])})`],
    [`${LABEL_PREFIX} — add-ons`, addOns.length > 0 ? addOns.join(', ') : 'None'],
    [
      `${LABEL_PREFIX} — content updates`,
      selection.updatesEnabled
        ? `${UPDATE_TIER_LABELS[selection.updates]} (+${money(UPDATE_TIER_PRICES[selection.updates])})`
        : 'Not included',
    ],
    [`${LABEL_PREFIX} — monthly total`, `${money(getMonthlyTotal(selection))} / month`]
  );
  /* eslint-enable security/detect-object-injection */

  if (needsCustomQuote(selection)) {
    rows.push([`${LABEL_PREFIX} — note`, 'Top slider position reached: needs a personal quote']);
  }

  return rows;
}
