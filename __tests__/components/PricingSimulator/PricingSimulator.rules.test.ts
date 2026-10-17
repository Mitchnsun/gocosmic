import { describe, expect, it } from 'vitest';

import { PAGE_TIERS, UPDATE_TIERS } from '@/components/PricingSimulator/constants';
import {
  clampMailboxes,
  clampTier,
  getCascade,
  normalizePlan,
  setFormula,
  setMailboxes,
  setOwnDomain,
  setPages,
  setTier,
  setUpdates,
  toggleAddOn,
  toggleTiered,
  toggleUpdates,
} from '@/components/PricingSimulator/PricingSimulator.rules';

import { makeSelection as plan } from '../../lib/pricing/plan-fixtures';

/** A plan without a domain name of its own: the studio manages one, and the email address can be ticked. */
const withEmail = (overrides: Parameters<typeof plan>[0] = {}) =>
  plan({ ownDomain: false, ...overrides, addOns: { domain: true, email: true, ...overrides.addOns } });

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

  it('records the answer about an existing domain name', () => {
    expect(setOwnDomain(plan(), true).ownDomain).toBe(true);
    expect(setOwnDomain(plan(), false).ownDomain).toBe(false);
  });

  it('resets the extras when the email address is unticked', () => {
    const next = toggleAddOn(withEmail({ addOns: { redirects: true }, mailboxes: 2 }), 'email');

    expect(next.addOns).toMatchObject({ domain: true, email: false, redirects: false });
    expect(next.mailboxes).toBe(0);
  });

  it('toggles a slider option on at its first tier, and the detailed statistics off with statistics', () => {
    const on = toggleTiered(plan(), 'analytics');
    expect(on.analytics).toBe(0);

    const off = toggleTiered({ ...on, addOns: { ...on.addOns, detailed_analytics: true } }, 'analytics');
    expect(off.analytics).toBeNull();
    expect(off.addOns.detailed_analytics).toBe(false);

    expect(toggleTiered(toggleTiered(plan(), 'news'), 'news').news).toBeNull();
  });

  it('clamps tiers, pages and updates onto their table', () => {
    expect(setTier(plan(), 'seo', 7).seo).toBe(1);
    expect(setTier(plan(), 'articles', 3).articles).toBe(3);
    expect(setTier(plan(), 'news', 9).news).toBe(2);
    expect(setPages(plan(), 3).pages).toBe(3);
    expect(setUpdates(plan(), 9).updates).toBe(UPDATE_TIERS.length - 1);
    expect(toggleUpdates(plan()).updatesEnabled).toBe(true);
  });

  it('only counts extra mailboxes with an email address', () => {
    expect(setMailboxes(plan(), 3).mailboxes).toBe(0);
    expect(setMailboxes(withEmail(), 3).mailboxes).toBe(3);
    expect(setMailboxes(withEmail(), 9).mailboxes).toBe(5);
  });
});

describe('getCascade', () => {
  it('names the detailed statistics when unticking statistics would remove them', () => {
    expect(getCascade(plan({ analytics: 1, addOns: { detailed_analytics: true } }), 'analytics')).toBe(
      'detailed_analytics'
    );
    expect(getCascade(plan({ analytics: 1 }), 'analytics')).toBeNull();
    expect(getCascade(plan(), 'analytics')).toBeNull();
  });

  it('names the email extras when unticking the email address would remove them', () => {
    expect(getCascade(withEmail({ mailboxes: 1 }), 'email')).toBe('email_extras');
    expect(getCascade(withEmail({ addOns: { redirects: true } }), 'email')).toBe('email_extras');
    expect(getCascade(withEmail(), 'email')).toBeNull();
    // Ticking it back removes nothing.
    expect(getCascade(plan({ ownDomain: false, mailboxes: 2 }), 'email')).toBeNull();
  });
});

describe('normalizePlan', () => {
  it('leaves a consistent plan untouched and is idempotent', () => {
    const consistent = withEmail({ pages: 2, news: 1 });
    expect(normalizePlan(consistent)).toEqual(consistent);

    const messy = plan({ formula: 'self_service', addOns: { email: true }, news: 2, articles: 3, mailboxes: 4 });
    expect(normalizePlan(normalizePlan(messy))).toEqual(normalizePlan(messy));
  });

  it('makes the domain part of the plan without a domain name of its own, and leaves it out otherwise', () => {
    expect(normalizePlan(plan({ ownDomain: false })).addOns.domain).toBe(true);
    expect(normalizePlan(plan({ ownDomain: null, addOns: { domain: true } })).addOns.domain).toBe(false);

    const own = normalizePlan(withEmail({ ownDomain: true, addOns: { redirects: true }, mailboxes: 2 }));
    expect(own.addOns).toMatchObject({ domain: false, email: false, redirects: false });
    expect(own.mailboxes).toBe(0);
  });

  it('brings the email address back when answering again that there is no domain yet', () => {
    const choices = withEmail({ mailboxes: 2 });

    expect(normalizePlan(setOwnDomain(choices, true)).addOns.email).toBe(false);
    expect(normalizePlan(setOwnDomain(setOwnDomain(choices, true), false))).toMatchObject({
      addOns: { email: true },
      mailboxes: 2,
    });
  });

  it('never charges news in "You stay in control", but keeps the choice for later', () => {
    const choices = plan({ formula: 'self_service', news: 1 });

    expect(normalizePlan(choices).news).toBeNull();
    expect(normalizePlan(setFormula(choices, 'managed')).news).toBe(1);
  });

  it('drops options whose parent is missing', () => {
    const next = normalizePlan(
      plan({ addOns: { email: true, redirects: true, detailed_analytics: true }, mailboxes: 2 })
    );

    expect(next.addOns).toMatchObject({ email: false, redirects: false, detailed_analytics: false });
    expect(next.mailboxes).toBe(0);
  });

  it('keeps the content changes apart from the articles', () => {
    expect(normalizePlan(plan({ articles: 3 }))).toMatchObject({ articles: 3, updatesEnabled: false });
  });
});
