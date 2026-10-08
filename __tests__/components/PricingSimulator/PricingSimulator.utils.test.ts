import { describe, expect, it } from 'vitest';

import { BASE_PRICE, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import {
  formatAmount,
  getAddOnPrice,
  getMonthlyTotal,
  getPlanItems,
  needsCustomQuote,
} from '@/components/PricingSimulator/PricingSimulator.utils';

import { makeSelection as plan } from '../../lib/pricing/plan-fixtures';

describe('prices', () => {
  it('keeps the advertised entry price and prices "You stay in control" as a whole', () => {
    expect(BASE_PRICE).toBe(10);
    expect(FORMULA_PRICES).toEqual({ managed: 10, self_service: 20 });
  });

  it('exposes each add-on price', () => {
    expect(getAddOnPrice('domain')).toBe(5);
    expect(getAddOnPrice('swiss_hosting')).toBe(10);
    expect(getAddOnPrice('email')).toBe(15);
    expect(getAddOnPrice('contact_form')).toBe(5);
    expect(getAddOnPrice('redirects')).toBe(5);
  });
});

describe('getPlanItems', () => {
  it('lists only the formula for an untouched plan', () => {
    expect(getPlanItems(plan())).toEqual([{ id: 'formula', amount: 10 }]);
  });

  it('lists every paid choice in the order of the builder', () => {
    const items = getPlanItems(
      normalizePlan(
        plan({
          pages: 2,
          addOns: { monitoring: true, contact_form: true, domain: true, email: true, detailed_analytics: true },
          mailboxes: 2,
          analytics: 1,
          seo: 0,
          articles: 1,
        })
      )
    );

    expect(items).toEqual([
      { id: 'formula', amount: 10 },
      { id: 'pages', amount: 15, tier: 'five_seven' },
      { id: 'contact_form', amount: 5 },
      { id: 'domain', amount: 5 },
      { id: 'email', amount: 15 },
      { id: 'mailboxes', amount: 20, count: 2 },
      { id: 'seo', amount: 5, tier: 'quarterly' },
      { id: 'analytics', amount: 15, tier: 'quarterly' },
      { id: 'detailed_analytics', amount: 5 },
      { id: 'updates', amount: 60, tier: 'weekly' },
      { id: 'articles', amount: 15, tier: 'weekly' },
      { id: 'monitoring', amount: 5 },
    ]);
  });
});

describe('getMonthlyTotal', () => {
  it('charges the formula price for an untouched plan', () => {
    expect(getMonthlyTotal(plan())).toBe(10);
    expect(getMonthlyTotal(plan({ formula: 'self_service' }))).toBe(20);
  });

  it('ignores the update slider until the package is enabled', () => {
    expect(getMonthlyTotal(plan({ updates: 4 }))).toBe(10);
    expect(getMonthlyTotal(plan({ updates: 4, updatesEnabled: true }))).toBe(210);
  });

  it('sums add-ons, pages and updates together', () => {
    const total = getMonthlyTotal(
      plan({ addOns: { domain: true, email: true }, pages: 2, updatesEnabled: true, updates: 1 })
    );
    // 10 base + 5 domain + 15 email + 15 pages + 20 updates
    expect(total).toBe(65);
  });

  it('matches the examples of the offer', () => {
    // We take care of everything + contact form + one article a week, which lifts updates to weekly.
    expect(getMonthlyTotal(normalizePlan(plan({ addOns: { contact_form: true }, articles: 1 })))).toBe(90);
    // You stay in control + contact form + booking + email (with its domain).
    expect(
      getMonthlyTotal(
        normalizePlan(
          plan({ formula: 'self_service', addOns: { contact_form: true, booking: true, domain: true, email: true } })
        )
      )
    ).toBe(50);
  });

  it('charges each extra mailbox', () => {
    expect(getMonthlyTotal(plan({ addOns: { domain: true, email: true }, mailboxes: 3 }))).toBe(60);
  });
});

describe('needsCustomQuote', () => {
  it('stays quiet for plans the sliders cover', () => {
    expect(needsCustomQuote(plan())).toBe(false);
    expect(needsCustomQuote(plan({ pages: 3, updatesEnabled: true, updates: 3, mailboxes: 4 }))).toBe(false);
  });

  it('flags the top page tier', () => {
    expect(needsCustomQuote(plan({ pages: 4 }))).toBe(true);
  });

  it('flags the top update tier only when the package is enabled', () => {
    expect(needsCustomQuote(plan({ updates: 4 }))).toBe(false);
    expect(needsCustomQuote(plan({ updates: 4, updatesEnabled: true }))).toBe(true);
  });

  it('flags the largest number of extra mailboxes', () => {
    expect(needsCustomQuote(plan({ mailboxes: 5 }))).toBe(true);
  });
});

describe('formatAmount', () => {
  it('labels the amount with the visitor currency', () => {
    expect(formatAmount(10, 'eur')).toBe('10€');
    expect(formatAmount(10, 'chf')).toBe('10 CHF');
  });

  it('follows the conventions of the page language when given one', () => {
    expect(formatAmount(10, 'eur', 'fr')).toMatch(/^10\s€$/);
    expect(formatAmount(10, 'eur', 'en')).toBe('€10');
    expect(formatAmount(3500, 'chf', 'fr')).toMatch(/^3\s500\sCHF$/);
    expect(formatAmount(10, 'chf', 'en')).toMatch(/^CHF\s10$/);
  });
});
