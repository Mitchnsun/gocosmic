import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next-intl/plugin', () => ({
  default: () => (config: NextConfigWithHeaders) => config,
}));

interface NextConfigWithHeaders {
  headers?: () => Promise<
    {
      headers: { key: string; value: string }[];
      source: string;
    }[]
  >;
}

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
  it('sends the retired offers, pricing and journey pages to the matching Services section, in every locale', async () => {
    vi.resetModules();
    const { default: nextConfig } = (await import('../next.config')) as {
      default: { redirects: () => Promise<{ source: string; destination: string; permanent: boolean }[]> };
    };
    const redirects = await nextConfig.redirects();
    const find = (source: string) => redirects.find((redirect) => redirect.source === source);

    expect(find('/fr/nos-offres')).toEqual({
      source: '/fr/nos-offres',
      destination: '/fr/services#pricing',
      permanent: true,
    });
    expect(find('/de/preise')?.destination).toBe('/de/dienstleistungen#simulator');
    expect(find('/it/viaggio')?.destination).toBe('/it/servizi');
    expect(find('/es/pricing')?.destination).toBe('/es/servicios#simulator');
    expect(find('/offers')?.destination).toBe('/services#pricing');
    expect(find('/journey')?.destination).toBe('/services');
    expect(redirects.every((redirect) => redirect.permanent)).toBe(true);
    // 3 retired pages × (1 unprefixed + 1 for en + 2 per other locale), then the local page under each of the 10 prefixes.
    expect(redirects).toHaveLength(3 * (1 + 1 + 2 * 4) + 10);
  });

  it('sends the former local page slugs to the current ones, Swiss prefixes included', async () => {
    vi.resetModules();
    const { default: nextConfig } = (await import('../next.config')) as {
      default: { redirects: () => Promise<{ source: string; destination: string; permanent: boolean }[]> };
    };
    const redirects = await nextConfig.redirects();
    const find = (source: string) => redirects.find((redirect) => redirect.source === source);

    expect(find('/fr/developpeur-web-mobile-annecy-geneve')).toEqual({
      source: '/fr/developpeur-web-mobile-annecy-geneve',
      destination: '/fr/creation-site-internet-geneve-annecy',
      permanent: true,
    });
    expect(find('/fr-ch/developpeur-web-mobile-annecy-geneve')?.destination).toBe(
      '/fr-ch/creation-site-internet-geneve-annecy'
    );
    expect(find('/de-ch/web-mobile-entwickler-annecy-genf')?.destination).toBe(
      '/de-ch/website-erstellen-lassen-genf-annecy'
    );
  });
});
