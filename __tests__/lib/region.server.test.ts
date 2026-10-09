import { beforeEach, describe, expect, it, vi } from 'vitest';

const getLocaleMock = vi.fn();

vi.mock('next-intl/server', () => ({
  getLocale: () => getLocaleMock(),
}));

const { getRegion } = await import('@/lib/region.server');

describe('getRegion', () => {
  beforeEach(() => {
    getLocaleMock.mockReset();
  });

  it.each(['fr-CH', 'de-CH', 'en-CH'])('returns the ch region on the Swiss locale %s', async (locale) => {
    getLocaleMock.mockResolvedValue(locale);
    await expect(getRegion()).resolves.toBe('ch');
  });

  it.each(['fr', 'de', 'en'])('returns the fr region on the language-only locale %s', async (locale) => {
    getLocaleMock.mockResolvedValue(locale);
    await expect(getRegion()).resolves.toBe('fr');
  });
});
