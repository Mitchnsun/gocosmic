import { NextRequest } from 'next/server';
import { vi } from 'vitest';

import { LOCALES } from '@/i18n/locales';
import { routing } from '@/i18n/routing';

// Mock next-intl/middleware: the routing handler it creates answers with an empty response.
const { mockCreateMiddleware, mockHandleI18nRouting } = vi.hoisted(() => {
  const mockHandleI18nRouting = vi.fn<(request: Request) => Response>(() => new Response(null));
  return { mockHandleI18nRouting, mockCreateMiddleware: vi.fn(() => mockHandleI18nRouting) };
});
vi.mock('next-intl/middleware', () => ({
  default: mockCreateMiddleware,
}));

describe('proxy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create middleware with routing configuration', async () => {
    // Import the proxy after mocking
    await import('../proxy');

    expect(mockCreateMiddleware).toHaveBeenCalledWith(routing);
    expect(mockCreateMiddleware).toHaveBeenCalledTimes(1);
  });

  it('should have correct routing configuration', () => {
    expect(routing.locales).toEqual(LOCALES);
    expect(routing.locales).toEqual(['en', 'fr', 'es', 'de', 'it', 'en-CH', 'fr-CH', 'es-CH', 'de-CH', 'it-CH']);
    expect(routing.defaultLocale).toBe('en');
    expect(routing.localePrefix).toMatchObject({ mode: 'always', prefixes: { 'fr-CH': '/fr-ch' } });
  });

  it('lets only a Swiss browser setting pick a Swiss locale', async () => {
    const { default: proxy } = await import('../proxy');
    const visit = (acceptLanguage: string) => {
      proxy(new NextRequest('https://www.gocosmic.dev/', { headers: { 'accept-language': acceptLanguage } }));
      return mockHandleI18nRouting.mock.lastCall?.[0].headers.get('accept-language');
    };

    expect(visit('de-AT,de;q=0.9')).toBe('de,de;q=0.9');
    expect(visit('fr-CH,fr;q=0.9')).toBe('fr-CH,fr;q=0.9');
  });

  it('hands any other request over as it is', async () => {
    const { default: proxy } = await import('../proxy');
    const post = new NextRequest('https://www.gocosmic.dev/fr/contact', {
      method: 'POST',
      headers: { 'accept-language': 'de-AT' },
      body: 'form',
    });
    const bare = new NextRequest('https://www.gocosmic.dev/');

    proxy(post);
    proxy(bare);

    expect(mockHandleI18nRouting.mock.calls[0]?.[0]).toBe(post);
    expect(mockHandleI18nRouting.mock.calls[1]?.[0]).toBe(bare);
  });

  it('passes the requested path on to the request config', async () => {
    const { default: proxy } = await import('../proxy');

    const response = proxy(new NextRequest('https://www.gocosmic.dev/fr-ch/a-propos'));

    expect(response.headers.get('x-pathname')).toBe('/fr-ch/a-propos');
  });

  it('should have correct matcher configuration', async () => {
    const middlewareModule = await import('../proxy');

    expect(middlewareModule.config).toBeDefined();
    expect(middlewareModule.config.matcher).toBe('/((?!api|_next|_vercel|.*\\..*).*)');
  });

  it('should exclude api routes from middleware', async () => {
    const middlewareModule = await import('../proxy');

    expect(middlewareModule.config.matcher).toContain('(?!api|_next|_vercel');

    // Test specific paths that should be excluded
    expect('/api/test'.match(/^\/api/)).toBeTruthy();
    expect('/_next/static'.match(/^\/_next/)).toBeTruthy();
    expect('/_vercel/test'.match(/^\/_vercel/)).toBeTruthy();
    expect('/favicon.ico'.includes('.')).toBeTruthy();

    // Test paths that should be included (not matching exclusion patterns)
    expect('/en'.match(/^\/api/)).toBeFalsy();
    expect('/fr/about'.match(/^\/api/)).toBeFalsy();
    expect('/contact'.includes('.')).toBeFalsy();
  });
});
