import { describe, expect, it } from 'vitest';

import { BASE_PRICE, INITIAL_SELECTION } from '@/components/PricingSimulator/constants';
import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import {
  formatAmount,
  getAddOnPrice,
  getMonthlyTotal,
  getPageTierPrice,
  getUpdateTierPrice,
  needsCustomQuote,
  toTierIndex,
} from '@/components/PricingSimulator/PricingSimulator.utils';

const plan = (overrides: Partial<PlanSelection> = {}): PlanSelection => ({
  ...INITIAL_SELECTION,
  ...overrides,
  addOns: { ...INITIAL_SELECTION.addOns, ...overrides.addOns },
});

describe('toTierIndex', () => {
  it('keeps valid positions untouched', () => {
    expect(toTierIndex(0)).toBe(0);
    expect(toTierIndex(4)).toBe(4);
  });

  it('clamps values outside the slider range', () => {
    expect(toTierIndex(-3)).toBe(0);
    expect(toTierIndex(9)).toBe(4);
  });

  it('snaps fractional and unparsable values onto a position', () => {
    expect(toTierIndex(2.4)).toBe(2);
    expect(toTierIndex(Number.NaN)).toBe(0);
  });
});

describe('tier prices', () => {
  it('leaves the first page free and charges the top tier', () => {
    expect(getPageTierPrice(0)).toBe(0);
    expect(getPageTierPrice(4)).toBe(25);
  });

  it('charges from the first update tier upwards', () => {
    expect(getUpdateTierPrice(0)).toBe(5);
    expect(getUpdateTierPrice(4)).toBe(100);
  });

  it('exposes each add-on price', () => {
    expect(getAddOnPrice('domain')).toBe(5);
    expect(getAddOnPrice('swiss_hosting')).toBe(10);
    expect(getAddOnPrice('email')).toBe(10);
  });
});

describe('getMonthlyTotal', () => {
  it('charges the advertised base price for an untouched plan', () => {
    expect(getMonthlyTotal(plan())).toBe(BASE_PRICE);
    expect(BASE_PRICE).toBe(10);
  });

  it('adds every ticked add-on', () => {
    expect(getMonthlyTotal(plan({ addOns: { domain: true, swiss_hosting: true, email: true } }))).toBe(35);
  });

  it('adds the page tier', () => {
    expect(getMonthlyTotal(plan({ pages: 3 }))).toBe(30);
  });

  it('ignores the update slider until the package is enabled', () => {
    expect(getMonthlyTotal(plan({ updates: 4 }))).toBe(BASE_PRICE);
    expect(getMonthlyTotal(plan({ updates: 4, updatesEnabled: true }))).toBe(110);
  });

  it('sums add-ons, pages and updates together', () => {
    const total = getMonthlyTotal(
      plan({ addOns: { domain: true, swiss_hosting: false, email: true }, pages: 2, updatesEnabled: true, updates: 1 })
    );
    // 10 base + 5 domain + 10 email + 10 pages + 15 updates
    expect(total).toBe(50);
  });
});

describe('needsCustomQuote', () => {
  it('stays quiet for plans the sliders cover', () => {
    expect(needsCustomQuote(plan())).toBe(false);
    expect(needsCustomQuote(plan({ pages: 3, updatesEnabled: true, updates: 3 }))).toBe(false);
  });

  it('flags the top page tier', () => {
    expect(needsCustomQuote(plan({ pages: 4 }))).toBe(true);
  });

  it('flags the top update tier only when the package is enabled', () => {
    expect(needsCustomQuote(plan({ updates: 4 }))).toBe(false);
    expect(needsCustomQuote(plan({ updates: 4, updatesEnabled: true }))).toBe(true);
  });
});

describe('formatAmount', () => {
  it('labels the amount with the visitor currency', () => {
    expect(formatAmount(10, 'eur')).toBe('10€');
    expect(formatAmount(10, 'chf')).toBe('10 CHF');
  });
});
