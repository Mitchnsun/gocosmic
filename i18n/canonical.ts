import { routing } from '@/i18n/routing';

export const SITE_URL = 'https://www.gocosmic.dev';

type Locale = (typeof routing.locales)[number];
type PathKey = keyof typeof routing.pathnames;

/**
 * Returns the canonical URL for a given locale and route pathname key.
 * e.g. getCanonicalUrl('fr', '/about') => 'https://www.gocosmic.dev/fr/a-propos'
 */
export function getCanonicalUrl(locale: string, routeKey: PathKey): string {
  // eslint-disable-next-line security/detect-object-injection
  const pathnames = routing.pathnames[routeKey];
  const localizedPath =
    typeof pathnames === 'string'
      ? pathnames
      : (Object.entries(pathnames as Record<Locale, string>).find(([key]) => key === locale)?.[1] ?? '/');
  return `${SITE_URL}/${locale}${localizedPath === '/' ? '/' : localizedPath}`;
}
