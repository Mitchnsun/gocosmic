import { FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import type { AddOnKey, PlanItem } from '@/components/PricingSimulator/PricingSimulator.types';
import {
  formatAmount,
  getMonthlyTotal,
  getPlanItems,
  needsCustomQuote,
} from '@/components/PricingSimulator/PricingSimulator.utils';
import type { DecodedPlan } from '@/lib/pricing/plan-code';
import {
  ADD_ON_LABELS,
  FORMULA_LABELS,
  PROJECT_TYPE_LABELS,
  TIER_LABELS,
  WEBSITE_TYPE_LABELS,
} from '@/lib/pricing/plan-labels';
import { getCurrency } from '@/lib/region';

const LABEL_PREFIX = 'Simulation';
const MONTHLY = '/ month excl. VAT';

const isAddOn = (id: PlanItem['id']): id is AddOnKey => id in ADD_ON_LABELS;

/**
 * Turns a decoded pricing simulation into `[label, value]` rows for the studio
 * email. The monthly total is recomputed from the price table: the figure the
 * visitor saw is never transmitted, so it cannot be forged.
 */
export function buildPlanEmailRows(plan: DecodedPlan): Array<[string, string]> {
  const { projectType, websiteType, region } = plan;
  const money = (amount: number) => formatAmount(amount, getCurrency(region));

  const rows: Array<[string, string]> = [[`${LABEL_PREFIX} — project`, PROJECT_TYPE_LABELS[projectType]]];

  if (websiteType) {
    rows.push([`${LABEL_PREFIX} — site type`, WEBSITE_TYPE_LABELS[websiteType]]);
  }

  // Only a showcase site is priced; every other path is quoted personally.
  if (projectType !== 'website' || websiteType !== 'showcase') {
    rows.push([`${LABEL_PREFIX} — pricing`, 'Custom quote (no figure shown to the visitor)']);
    return rows;
  }

  const selection = normalizePlan(plan.selection);
  const items = getPlanItems(selection);
  const find = (id: PlanItem['id']) => items.find((item) => item.id === id);
  const tiered = (id: 'updates' | 'analytics' | 'seo' | 'articles', fallback: string) => {
    const item = find(id);
    return item?.tier ? `${TIER_LABELS[id][item.tier]} (+${money(item.amount)})` : fallback;
  };

  const pages = find('pages');
  const addOns = items.flatMap((item) => {
    if (isAddOn(item.id)) return [`${ADD_ON_LABELS[item.id]} (+${money(item.amount)})`];
    if (item.id === 'mailboxes') return [`${item.count} extra mailbox(es) (+${money(item.amount)})`];
    return [];
  });

  rows.push(
    [
      `${LABEL_PREFIX} — formula`,
      `${FORMULA_LABELS[selection.formula]}: ${money(FORMULA_PRICES[selection.formula])} ${MONTHLY}`,
    ],
    [
      `${LABEL_PREFIX} — pages`,
      pages?.tier
        ? `${TIER_LABELS.pages[pages.tier]} (+${money(pages.amount)}${pages.tier === 'ten_plus' ? ' or more' : ''})`
        : '1 page (included)',
    ],
    [`${LABEL_PREFIX} — add-ons`, addOns.length > 0 ? addOns.join(', ') : 'None'],
    [`${LABEL_PREFIX} — local search follow-up`, tiered('seo', 'Not included')],
    [`${LABEL_PREFIX} — visit statistics`, tiered('analytics', 'Not included')],
    [`${LABEL_PREFIX} — content updates`, tiered('updates', 'Once a year (included)')],
    [`${LABEL_PREFIX} — AI-assisted articles`, tiered('articles', 'Not included')],
    [`${LABEL_PREFIX} — monthly total`, `${money(getMonthlyTotal(selection))} ${MONTHLY}`]
  );

  if (needsCustomQuote(selection)) {
    rows.push([`${LABEL_PREFIX} — note`, 'Top position reached (pages, updates or mailboxes): needs a personal quote']);
  }

  return rows;
}
