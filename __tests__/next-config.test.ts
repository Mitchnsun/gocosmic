import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/plugin', () => ({
  default: () => (config: NextConfigWithHeaders) => config,
}));

type NextConfigWithHeaders = {
  headers?: () => Promise<
    {
      headers: { key: string; value: string }[];
      source: string;
    }[]
  >;
};

const getCspForEnvironment = async (nodeEnvironment: string) => {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', nodeEnvironment);

  const { default: nextConfig } = (await import('../next.config')) as {
    default: NextConfigWithHeaders;
  };
  const headerRoutes = await nextConfig.headers?.();
  const globalHeaders = headerRoutes?.find(({ source }) => source === '/(.*)');

  return globalHeaders?.headers.find(({ key }) => key === 'Content-Security-Policy')?.value;
};

describe('next config security headers', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('allows eval only for React development tooling', async () => {
    const csp = await getCspForEnvironment('development');

    expect(csp).toContain("script-src 'self' 'unsafe-inline' 'unsafe-eval'");
  });

  it('keeps eval disabled in production', async () => {
    const csp = await getCspForEnvironment('production');

    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
    expect(csp).not.toContain("'unsafe-eval'");
  });
});

describe('next config frame policy', () => {
  it('only lets Google Calendar be framed, and never the site itself', async () => {
    const csp = await getCspForEnvironment('production');

    expect(csp).toContain('frame-src https://calendar.google.com');
    expect(csp).toContain("frame-ancestors 'none'");
  });
});

describe('next config legacy redirects', () => {
  it('sends the retired offers, pricing and journey pages to Services & pricing, in every locale', async () => {
    vi.resetModules();
    const { default: nextConfig } = (await import('../next.config')) as {
      default: { redirects: () => Promise<{ source: string; destination: string; permanent: boolean }[]> };
    };
    const redirects = await nextConfig.redirects();
    const find = (source: string) => redirects.find((redirect) => redirect.source === source);

    expect(find('/fr/nos-offres')).toEqual({ source: '/fr/nos-offres', destination: '/fr/services', permanent: true });
    expect(find('/de/preise')?.destination).toBe('/de/dienstleistungen');
    expect(find('/it/viaggio')?.destination).toBe('/it/servizi');
    expect(find('/es/pricing')?.destination).toBe('/es/servicios');
    expect(find('/journey')?.destination).toBe('/services');
    expect(redirects.every((redirect) => redirect.permanent)).toBe(true);
    // 3 pages × (1 unprefixed + 1 for en + 2 per other locale).
    expect(redirects).toHaveLength(3 * (1 + 1 + 2 * 4));
  });
});
