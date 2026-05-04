import { routing } from '@/i18n/routing';

export const SITE_URL = 'https://www.gocosmic.dev';

export type Locale = (typeof routing.locales)[number];
type PathKey = keyof typeof routing.pathnames;

function getLocalizedPath(pathnames: string | Record<Locale, string>, locale: string): string {
  if (typeof pathnames === 'string') return pathnames;
  return Object.entries(pathnames).find(([key]) => key === locale)?.[1] ?? '/';
}

/**
 * Returns the canonical URL for a given locale and route pathname key.
 * e.g. getCanonicalUrl('fr', '/about') => 'https://www.gocosmic.dev/fr/a-propos'
 */
export function getCanonicalUrl(locale: string, routeKey: PathKey): string {
  // eslint-disable-next-line security/detect-object-injection
  const pathnames = routing.pathnames[routeKey];
  const localizedPath = getLocalizedPath(pathnames as string | Record<Locale, string>, locale);

  if (localizedPath === '/') {
    return `${SITE_URL}/${locale}/`;
  }
  return `${SITE_URL}/${locale}${localizedPath}`;
}
