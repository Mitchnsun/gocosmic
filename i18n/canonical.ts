import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';

export { SITE_URL };

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

/**
 * hreflang map for a route: its URL in every locale, plus `x-default` pointing
 * to the default locale. Shared by page metadata and the sitemap.
 */
export function getLanguageAlternates(routeKey: PathKey): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((locale) => [locale, getCanonicalUrl(locale, routeKey)])),
    'x-default': getCanonicalUrl(routing.defaultLocale, routeKey),
  };
}

/**
 * `alternates` block of a page's metadata: canonical URL in the current locale
 * and the hreflang links to its translations.
 */
export function getAlternates(locale: string, routeKey: PathKey) {
  return {
    canonical: getCanonicalUrl(locale, routeKey),
    languages: getLanguageAlternates(routeKey),
  };
}
