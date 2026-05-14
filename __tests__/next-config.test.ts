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
