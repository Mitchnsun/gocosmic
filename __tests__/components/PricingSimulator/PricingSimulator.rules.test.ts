import { describe, expect, it } from 'vitest';

import { PAGE_TIERS, UPDATE_TIERS } from '@/components/PricingSimulator/constants';
import {
  clampMailboxes,
  clampTier,
  getUpdatesFloor,
  isUpdatesRaised,
  normalizePlan,
  setFormula,
  setMailboxes,
  setPages,
  setTier,
  setUpdates,
  toggleAddOn,
  toggleTiered,
  toggleUpdates,
} from '@/components/PricingSimulator/PricingSimulator.rules';

import { makeSelection as plan } from '../../lib/pricing/plan-fixtures';

describe('clamping', () => {
  it('keeps valid positions and clamps the rest onto the table', () => {
    expect(clampTier(0, PAGE_TIERS)).toBe(0);
    expect(clampTier(4, PAGE_TIERS)).toBe(4);
    expect(clampTier(-3, PAGE_TIERS)).toBe(0);
    expect(clampTier(9, PAGE_TIERS)).toBe(4);
    expect(clampTier(2.4, PAGE_TIERS)).toBe(2);
    expect(clampTier(Number.NaN, PAGE_TIERS)).toBe(0);
  });

  it('keeps the number of extra mailboxes between 0 and 5', () => {
    expect(clampMailboxes(3)).toBe(3);
    expect(clampMailboxes(-1)).toBe(0);
    expect(clampMailboxes(12)).toBe(5);
    expect(clampMailboxes(Number.NaN)).toBe(0);
  });
});

describe('visitor actions', () => {
  it('switches the formula', () => {
    expect(setFormula(plan(), 'self_service').formula).toBe('self_service');
  });

  it('ticks the domain along with the email address', () => {
    const next = toggleAddOn(plan(), 'email');
    expect(next.addOns).toMatchObject({ email: true, domain: true });
  });

  it('unticks the email address and its extras along with the domain', () => {
    const withEmail = plan({ addOns: { domain: true, email: true, redirects: true }, mailboxes: 3 });

    const next = toggleAddOn(withEmail, 'domain');

    expect(next.addOns).toMatchObject({ domain: false, email: false, redirects: false });
    expect(next.mailboxes).toBe(0);
  });

  it('resets the extras when the email address is unticked', () => {
    const next = toggleAddOn(plan({ addOns: { domain: true, email: true, redirects: true }, mailboxes: 2 }), 'email');

    expect(next.addOns).toMatchObject({ domain: true, email: false, redirects: false });
    expect(next.mailboxes).toBe(0);
  });

  it('toggles a slider option on at its first tier, and the detailed measurement off with statistics', () => {
    const on = toggleTiered(plan(), 'analytics');
    expect(on.analytics).toBe(0);

    const off = toggleTiered({ ...on, addOns: { ...on.addOns, detailed_analytics: true } }, 'analytics');
    expect(off.analytics).toBeNull();
    expect(off.addOns.detailed_analytics).toBe(false);

    expect(toggleTiered(toggleTiered(plan(), 'seo'), 'seo').seo).toBeNull();
  });

  it('clamps tiers, pages and updates onto their table', () => {
    expect(setTier(plan(), 'seo', 7).seo).toBe(1);
    expect(setTier(plan(), 'articles', 2).articles).toBe(2);
    expect(setPages(plan(), 3).pages).toBe(3);
    expect(setUpdates(plan(), 9)).toMatchObject({ updatesEnabled: true, updates: UPDATE_TIERS.length - 1 });
    expect(toggleUpdates(plan()).updatesEnabled).toBe(true);
  });

  it('ignores an update position below what the articles need', () => {
    const withArticles = plan({ articles: 1 });

    expect(setUpdates(withArticles, 0)).toBe(withArticles);
    expect(setUpdates(withArticles, 4)).toMatchObject({ updatesEnabled: true, updates: 4 });
  });

  it('only counts extra mailboxes with an email address', () => {
    expect(setMailboxes(plan(), 3).mailboxes).toBe(0);
    expect(setMailboxes(plan({ addOns: { domain: true, email: true } }), 3).mailboxes).toBe(3);
    expect(setMailboxes(plan({ addOns: { domain: true, email: true } }), 9).mailboxes).toBe(5);
  });
});

describe('getUpdatesFloor', () => {
  it('maps each article rhythm onto the update tier it needs', () => {
    expect(getUpdatesFloor(null)).toBeNull();
    expect(UPDATE_TIERS[getUpdatesFloor(0) ?? 0].key).toBe('monthly');
    expect(UPDATE_TIERS[getUpdatesFloor(1) ?? 0].key).toBe('weekly');
    expect(UPDATE_TIERS[getUpdatesFloor(2) ?? 0].key).toBe('unlimited');
  });
});

describe('normalizePlan', () => {
  it('leaves a consistent plan untouched and is idempotent', () => {
    const consistent = plan({ addOns: { domain: true, email: true }, pages: 2 });
    expect(normalizePlan(consistent)).toEqual(consistent);

    const messy = plan({ formula: 'self_service', addOns: { news: true, email: true }, articles: 2, mailboxes: 4 });
    expect(normalizePlan(normalizePlan(messy))).toEqual(normalizePlan(messy));
  });

  it('never charges the news section in "You stay in control", but keeps the choice for later', () => {
    const choices = plan({ formula: 'self_service', addOns: { news: true } });

    expect(normalizePlan(choices).addOns.news).toBe(false);
    expect(normalizePlan(setFormula(choices, 'managed')).addOns.news).toBe(true);
  });

  it('drops options whose parent is missing', () => {
    const next = normalizePlan(
      plan({ addOns: { email: true, redirects: true, detailed_analytics: true }, mailboxes: 2 })
    );

    expect(next.addOns).toMatchObject({ email: false, redirects: false, detailed_analytics: false });
    expect(next.mailboxes).toBe(0);
  });

  it('raises the update package to the rhythm of the articles', () => {
    const next = normalizePlan(plan({ articles: 1 }));

    expect(next.updatesEnabled).toBe(true);
    expect(UPDATE_TIERS[next.updates].key).toBe('weekly');
  });

  it("keeps the visitor's own update choice when it is already higher", () => {
    const next = normalizePlan(plan({ articles: 0, updatesEnabled: true, updates: 3 }));

    expect(next.updates).toBe(3);
  });

  it('falls back to the visitor choice once the articles are removed', () => {
    const choices = plan({ articles: 2, updatesEnabled: false, updates: 1 });

    expect(normalizePlan(choices).updates).toBe(UPDATE_TIERS.length - 1);
    expect(normalizePlan({ ...choices, articles: null })).toMatchObject({ updatesEnabled: false, updates: 1 });
  });
});

describe('isUpdatesRaised', () => {
  it('is true only when the articles lift the update package', () => {
    expect(isUpdatesRaised(plan())).toBe(false);
    expect(isUpdatesRaised(plan({ articles: 0 }))).toBe(true);
    expect(isUpdatesRaised(plan({ articles: 0, updatesEnabled: true, updates: 0 }))).toBe(true);
    expect(isUpdatesRaised(plan({ articles: 0, updatesEnabled: true, updates: 2 }))).toBe(false);
  });
});
