import { describe, expect, it } from 'vitest';

import { BASE_PRICE, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { normalizePlan } from '@/components/PricingSimulator/PricingSimulator.rules';
import {
  countAdvancedOptions,
  formatAmount,
  getAddOnPrice,
  getCommittedItems,
  getMonthlyTotal,
  getPlanItems,
  needsCustomQuote,
} from '@/components/PricingSimulator/PricingSimulator.utils';
import { ADVANCED_OPTIONS, OPTION_GROUPS } from '@/lib/pricing/price-list';

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
          ownDomain: false,
          pages: 2,
          addOns: { contact_form: true, email: true, detailed_analytics: true, redirects: true },
          mailboxes: 2,
          news: 0,
          analytics: 1,
          seo: 0,
          articles: 1,
          updatesEnabled: true,
          updates: 3,
        })
      )
    );

    expect(items).toEqual([
      { id: 'formula', amount: 10 },
      { id: 'pages', amount: 15, tier: 'five_seven' },
      { id: 'contact_form', amount: 5 },
      { id: 'news', amount: 10, tier: 'quarterly' },
      { id: 'domain', amount: 5 },
      { id: 'email', amount: 15 },
      { id: 'mailboxes', amount: 20, count: 2 },
      { id: 'updates', amount: 60, tier: 'weekly' },
      { id: 'redirects', amount: 5 },
      { id: 'seo', amount: 5, tier: 'quarterly' },
      { id: 'analytics', amount: 15, tier: 'quarterly' },
      { id: 'detailed_analytics', amount: 5 },
      { id: 'articles', amount: 25, tier: 'monthly' },
    ]);
  });

  it('bills every option of the builder groups, so none can show ticked without being charged', () => {
    const everything = normalizePlan(
      plan({
        ownDomain: false,
        pages: 1,
        addOns: Object.fromEntries(Object.keys(plan().addOns).map((key) => [key, true])),
        mailboxes: 1,
        news: 0,
        analytics: 0,
        seo: 0,
        articles: 0,
        updatesEnabled: true,
      })
    );

    expect(getPlanItems(everything).map((item) => item.id)).toEqual([
      'formula',
      ...Object.values(OPTION_GROUPS).flat(),
    ]);
  });
});

describe('getCommittedItems', () => {
  it('is empty for a plan that can be cancelled any month', () => {
    expect(
      getCommittedItems(normalizePlan(plan({ pages: 2, addOns: { contact_form: true }, updatesEnabled: true })))
    ).toEqual([]);
  });

  it('lists what turns the plan into 12-month periods, in recap order', () => {
    const items = getCommittedItems(
      normalizePlan(plan({ formula: 'self_service', ownDomain: false, addOns: { email: true }, articles: 0 }))
    );

    expect(items).toEqual(['formula', 'domain', 'email', 'articles']);
  });
});

describe('countAdvancedOptions', () => {
  it('counts the ticked options folded under "More options"', () => {
    expect(ADVANCED_OPTIONS).toEqual([
      'redirects',
      'seo',
      'analytics',
      'detailed_analytics',
      'articles',
      'swiss_hosting',
    ]);
    expect(countAdvancedOptions(plan({ addOns: { contact_form: true }, news: 0 }))).toBe(0);
    expect(
      countAdvancedOptions(normalizePlan(plan({ analytics: 0, addOns: { detailed_analytics: true }, seo: 1 })))
    ).toBe(3);
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
    // A client without a domain name pays at least the domain on top of the entry plan.
    expect(getMonthlyTotal(normalizePlan(plan({ ownDomain: false })))).toBe(15);
    // We take care of everything + contact form + one article a month, which no longer raises the content changes.
    expect(getMonthlyTotal(normalizePlan(plan({ addOns: { contact_form: true }, articles: 1 })))).toBe(40);
    // We take care of everything + news once a month + three articles a week.
    expect(getMonthlyTotal(normalizePlan(plan({ news: 1, articles: 3 })))).toBe(285);
    // You stay in control + contact form + booking + email (with its domain); news are never charged on top.
    expect(
      getMonthlyTotal(
        normalizePlan(
          plan({
            formula: 'self_service',
            ownDomain: false,
            news: 2,
            addOns: { contact_form: true, booking: true, email: true },
          })
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
