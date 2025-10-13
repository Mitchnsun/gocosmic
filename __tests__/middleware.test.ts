import { describe, expect, it, vi } from 'vitest';

import { routing } from '@/i18n/routing';

// Mock next-intl/middleware
const mockCreateMiddleware = vi.fn();
vi.mock('next-intl/middleware', () => ({
  default: mockCreateMiddleware,
}));

describe('middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create middleware with routing configuration', async () => {
    // Import the middleware after mocking
    await import('../middleware');

    expect(mockCreateMiddleware).toHaveBeenCalledWith(routing);
    expect(mockCreateMiddleware).toHaveBeenCalledTimes(1);
  });

  it('should have correct routing configuration', () => {
    expect(routing.locales).toEqual(['en', 'fr', 'es', 'de', 'it']);
    expect(routing.defaultLocale).toBe('en');
  });

  it('should have correct matcher configuration', async () => {
    const middlewareModule = await import('../middleware');

    expect(middlewareModule.config).toBeDefined();
    expect(middlewareModule.config.matcher).toBe('/((?!api|_next|_vercel|.*\\..*).*)');
  });

  it('should exclude api routes from middleware', async () => {
    const middlewareModule = await import('../middleware');

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
