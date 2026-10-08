import { beforeEach, describe, expect, it, vi } from 'vitest';

const headersMock = vi.fn();
const getLocaleMock = vi.fn();

vi.mock('next/headers', () => ({
  headers: () => headersMock(),
}));

vi.mock('next-intl/server', () => ({
  getLocale: () => getLocaleMock(),
}));

const { getRegion } = await import('@/lib/region.server');

/** Minimal stand-in for the read-only Headers object returned by `headers()`. */
const headersWith = (country: string | null) => ({
  get: (name: string) => (name === 'x-vercel-ip-country' ? country : null),
});

describe('getRegion', () => {
  beforeEach(() => {
    headersMock.mockReset();
    getLocaleMock.mockReset();
    getLocaleMock.mockResolvedValue('fr');
  });

  it('returns the ch region when the edge reports Switzerland', async () => {
    headersMock.mockResolvedValue(headersWith('CH'));
    await expect(getRegion()).resolves.toBe('ch');
  });

  it('returns the fr region for any other country', async () => {
    headersMock.mockResolvedValue(headersWith('FR'));
    await expect(getRegion()).resolves.toBe('fr');
  });

  it('returns the fr region when the header is missing', async () => {
    headersMock.mockResolvedValue(headersWith(null));
    await expect(getRegion()).resolves.toBe('fr');
  });

  it('returns the ch region on a Swiss locale, whatever the visitor country', async () => {
    getLocaleMock.mockResolvedValue('de-CH');
    headersMock.mockResolvedValue(headersWith('US'));

    await expect(getRegion()).resolves.toBe('ch');
    expect(headersMock).not.toHaveBeenCalled();
  });
});
