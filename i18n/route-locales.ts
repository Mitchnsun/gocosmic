// Relative imports only: `next.config.ts` and the QA suite load this module before path aliases exist.
import { getLanguage, type Language, LANGUAGES, type Locale, LOCALES } from './locales';
import { ROUTE_FALLBACK_LANGUAGES, ROUTE_LANGUAGES, type RouteKey } from './routing';

/** Languages a route is published in, when it is not published in every language. */
function getRouteLanguages(pathname: string): readonly Language[] | undefined {
  return ROUTE_LANGUAGES[pathname as RouteKey] ?? ROUTE_FALLBACK_LANGUAGES[pathname as RouteKey];
}

/** Whether a page exists in a locale; `pathname` is a route key, as next-intl's `usePathname` returns it. */
export function hasRoute(locale: string, pathname: string): boolean {
  const languages = getRouteLanguages(pathname);
  return !languages || languages.includes(getLanguage(locale));
}

/** Whether a page's other languages redirect to its English version (`ROUTE_FALLBACK_LANGUAGES`) instead of a 404. */
export function redirectsToEnglish(pathname: string): boolean {
  return ROUTE_FALLBACK_LANGUAGES[pathname as RouteKey] !== undefined;
}

/** Locales a route exists in, in the order of `LOCALES`: every one, unless `ROUTE_LANGUAGES` restricts it. */
export function getRouteLocales(routeKey: RouteKey): Locale[] {
  return LOCALES.filter((locale) => hasRoute(locale, routeKey));
}

/**
 * Languages a language switcher offers on a page: every one, the others leading to their home page, except on a
 * page whose other languages redirect to English, which offers its own languages only.
 */
export function getSwitcherLanguages(pathname: string): readonly Language[] {
  return redirectsToEnglish(pathname) ? LANGUAGES.filter((language) => hasRoute(language, pathname)) : LANGUAGES;
}
