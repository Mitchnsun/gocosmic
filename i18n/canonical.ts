import { getLocalePrefix } from '@/i18n/locales';
import { getRouteLocales } from '@/i18n/route-locales';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';

type PathKey = keyof typeof routing.pathnames;

function getLocalizedPath(pathnames: string | Record<string, string>, locale: string): string {
  if (typeof pathnames === 'string') return pathnames;
  return pathnames[locale] ?? '/';
}

/**
 * Returns the canonical URL for a given locale and route pathname key.
 * e.g. getCanonicalUrl('fr', '/about') => 'https://www.gocosmic.dev/fr/a-propos'
 * and getCanonicalUrl('fr-CH', '/about') => 'https://www.gocosmic.dev/fr-ch/a-propos'
 */
export function getCanonicalUrl(locale: string, routeKey: PathKey): string {
  const pathnames = routing.pathnames[routeKey];
  const localizedPath = getLocalizedPath(pathnames, locale);
  const prefix = getLocalePrefix(locale);

  // No trailing slash on the home page: `/fr/` permanently redirects to `/fr`, and a canonical URL must not redirect.
  return `${SITE_URL}${prefix}${localizedPath === '/' ? '' : localizedPath}`;
}

/**
 * hreflang map for a route: its URL in every locale it exists in, Swiss variants included
 * (`fr-CH`…), plus `x-default` pointing to the default locale, or to the first locale of a
 * page that does not exist in it. Shared by page metadata and the sitemap.
 */
export function getLanguageAlternates(routeKey: PathKey): Record<string, string> {
  const locales = getRouteLocales(routeKey);
  const fallback = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : (locales[0] ?? routing.defaultLocale);

  return {
    ...Object.fromEntries(locales.map((locale) => [locale, getCanonicalUrl(locale, routeKey)])),
    'x-default': getCanonicalUrl(fallback, routeKey),
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
