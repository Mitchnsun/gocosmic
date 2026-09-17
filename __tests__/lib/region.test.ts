import { describe, expect, it } from 'vitest';

import { DEFAULT_REGION, getCurrency, resolveRegion } from '@/lib/region';

describe('resolveRegion', () => {
  it('resolves Swiss visitors to the ch region', () => {
    expect(resolveRegion('CH')).toBe('ch');
  });

  it('accepts a lowercase or padded country code', () => {
    expect(resolveRegion('ch')).toBe('ch');
    expect(resolveRegion(' Ch ')).toBe('ch');
  });

  it('falls back to the default region for any other country', () => {
    expect(resolveRegion('FR')).toBe('fr');
    expect(resolveRegion('DE')).toBe('fr');
    expect(resolveRegion('US')).toBe('fr');
  });

  it('falls back to the default region when the country is unknown', () => {
    expect(resolveRegion(undefined)).toBe(DEFAULT_REGION);
    expect(resolveRegion(null)).toBe(DEFAULT_REGION);
    expect(resolveRegion('')).toBe(DEFAULT_REGION);
  });
});

describe('getCurrency', () => {
  it('quotes the French region in euros and the Swiss region in francs', () => {
    expect(getCurrency('fr')).toBe('eur');
    expect(getCurrency('ch')).toBe('chf');
  });
});
