import {
  getRateColorClass,
  getSubscriptionColor,
  getSubscriptionItems,
} from '@/components/PricingSimulator/PricingSimulator.utils';

describe('getRateColorClass', () => {
  it('returns amber class for amber accent', () => {
    expect(getRateColorClass('amber')).toBe('text-amber-400');
  });

  it('returns purple class for purple accent', () => {
    expect(getRateColorClass('purple')).toBe('text-purple-400');
  });

  it('returns yellow class for yellow accent', () => {
    expect(getRateColorClass('yellow')).toBe('text-yellow-400');
  });
});

describe('getSubscriptionItems', () => {
  it('returns 7 base items for few_per_year (no content_update)', () => {
    const items = getSubscriptionItems('few_per_year');
    expect(items).toEqual(['site', 'seo', 'updates', 'domain', 'hosting', 'ssl', 'email']);
    expect(items).not.toContain('content_update');
  });

  it('returns 8 items for monthly (includes content_update)', () => {
    const items = getSubscriptionItems('monthly');
    expect(items).toHaveLength(8);
    expect(items).toContain('content_update');
  });

  it('returns 8 items for weekly (includes content_update)', () => {
    const items = getSubscriptionItems('weekly');
    expect(items).toHaveLength(8);
    expect(items).toContain('content_update');
  });

  it('always includes the 7 base items', () => {
    const base = ['site', 'seo', 'updates', 'domain', 'hosting', 'ssl', 'email'];
    for (const freq of ['few_per_year', 'monthly', 'weekly'] as const) {
      const items = getSubscriptionItems(freq);
      for (const item of base) {
        expect(items).toContain(item);
      }
    }
  });
});

describe('getSubscriptionColor', () => {
  it('returns jungle color for few_per_year', () => {
    expect(getSubscriptionColor('few_per_year')).toBe('text-jungle');
  });

  it('returns blue color for monthly', () => {
    expect(getSubscriptionColor('monthly')).toBe('text-blue-400');
  });

  it('returns royal color for weekly', () => {
    expect(getSubscriptionColor('weekly')).toBe('text-royal');
  });
});
