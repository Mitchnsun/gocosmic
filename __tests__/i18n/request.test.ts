import { vi } from 'vitest';

import { getNamespacesForPath } from '@/i18n/request';
import { routing } from '@/i18n/routing';

vi.mock('next/headers', () => ({ headers: vi.fn() }));
vi.mock('next-intl/server', () => ({ getRequestConfig: (config: unknown) => config }));

const EXPECTED: Record<keyof typeof routing.pathnames, string[]> = {
  '/': ['home', 'pricing', 'projects'],
  '/about': ['about'],
  '/services': ['services', 'pricing'],
  '/projects': ['projects'],
  '/projects/daily-fortune': ['projects'],
  '/projects/mcomperat': ['projects'],
  '/projects/psc-supersprint': ['psc-supersprint', 'projects'],
  '/projects/choeurdespaysdumontblanc': ['projects'],
  '/contact': ['contact'],
  '/privacy': ['legal'],
  '/legal-notice': ['legal'],
  '/terms': ['legal'],
  '/design-system': ['home'],
  '/local': ['local', 'home', 'projects'],
  '/free-mockup': ['free-mockup'],
};

const prefixOf = (locale: string) => `/${locale.toLowerCase()}`;

describe('getNamespacesForPath', () => {
  it.each(Object.entries(EXPECTED))('maps %s to its namespaces in every locale', (route, namespaces) => {
    const entry = routing.pathnames[route as keyof typeof routing.pathnames];

    for (const locale of routing.locales) {
      const slug = typeof entry === 'string' ? entry : entry[locale];
      const path = slug === '/' ? prefixOf(locale) : `${prefixOf(locale)}${slug}`;

      expect(getNamespacesForPath(path), path).toEqual(namespaces);
    }
  });

  it('falls back to the homepage namespaces on an unknown route', () => {
    expect(getNamespacesForPath('/fr/nowhere')).toEqual(['home']);
  });
});
