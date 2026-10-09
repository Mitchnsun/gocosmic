import type { Currency } from '@/lib/region';

import {
  ADD_ON_PRICES,
  EXTRA_MAILBOX_PRICE,
  FORMULA_PRICES,
  MAX_EXTRA_MAILBOXES,
  PAGE_TIERS,
  TIERED_TABLES,
  UPDATE_TIERS,
} from './constants';
import type { AddOnKey, PlanItem, PlanSelection, TieredKey } from './PricingSimulator.types';

export function getAddOnPrice(key: AddOnKey): number {
  return ADD_ON_PRICES[key];
}

/** Price and tier key of a tick box + slider option, or `null` while it is unticked. */
function getTieredLine(plan: PlanSelection, key: TieredKey): { price: number; key: string } | null {
  const index = plan[key];
  return index === null ? null : (TIERED_TABLES[key][index] ?? null);
}

/** Order of the recap lines, following the groups of the builder. */
const ITEM_ORDER: readonly PlanItem['id'][] = [
  'formula',
  'pages',
  'contact_form',
  'booking',
  'reviews',
  'english',
  'news',
  'domain',
  'email',
  'mailboxes',
  'redirects',
  'swiss_hosting',
  'seo',
  'analytics',
  'detailed_analytics',
  'updates',
  'articles',
  'monitoring',
];

/**
 * Lines of a normalised plan (see `normalizePlan`), shared by the recap and the studio email: the
 * formula, then every paid choice. Unticked options and the included first page are left out.
 */
export function getPlanItems(plan: PlanSelection): PlanItem[] {
  const items: PlanItem[] = [];
  for (const id of ITEM_ORDER) {
    if (id === 'formula') items.push({ id, amount: FORMULA_PRICES[plan.formula] });
    else if (id === 'pages') {
      if (plan.pages > 0) items.push({ id, amount: PAGE_TIERS[plan.pages].price, tier: PAGE_TIERS[plan.pages].key });
    } else if (id === 'updates') {
      if (plan.updatesEnabled)
        items.push({ id, amount: UPDATE_TIERS[plan.updates].price, tier: UPDATE_TIERS[plan.updates].key });
    } else if (id === 'mailboxes') {
      if (plan.mailboxes > 0) items.push({ id, amount: plan.mailboxes * EXTRA_MAILBOX_PRICE, count: plan.mailboxes });
    } else if (id === 'analytics' || id === 'seo' || id === 'articles') {
      const line = getTieredLine(plan, id);
      if (line) items.push({ id, amount: line.price, tier: line.key });
    } else if (plan.addOns[id]) {
      items.push({ id, amount: getAddOnPrice(id) });
    }
  }
  return items;
}

/** Monthly total of a normalised plan: the sum of its lines. */
export function getMonthlyTotal(plan: PlanSelection): number {
  return getPlanItems(plan).reduce((sum, item) => sum + item.amount, 0);
}

/**
 * True once a volume sits on its top position (pages, updates, mailboxes): the plan still has a
 * price, but anything larger has to be quoted personally.
 */
export function needsCustomQuote(plan: PlanSelection): boolean {
  return (
    plan.pages === PAGE_TIERS.length - 1 ||
    (plan.updatesEnabled && plan.updates === UPDATE_TIERS.length - 1) ||
    plan.mailboxes === MAX_EXTRA_MAILBOXES
  );
}

/**
 * Amounts are identical in both currencies — only the symbol changes.
 * With a locale, the price follows that language's conventions (`10 €` in French, `€10` in English,
 * `1 500 CHF`…); without one, it stays compact (`10€`), e.g. in the studio's internal emails.
 */
export function formatAmount(amount: number, currency: Currency, locale?: string): string {
  if (locale) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency === 'chf' ? 'CHF' : 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return currency === 'chf' ? `${amount} CHF` : `${amount}€`;
}
