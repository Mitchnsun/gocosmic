// Relative imports only: `next.config.ts` and the QA suite load this module before path aliases exist.
import { getLanguage, type Locale, LOCALES } from './locales';
import { ROUTE_LANGUAGES, type RouteKey } from './routing';

/** Whether a page exists in a locale; `pathname` is a route key, as next-intl's `usePathname` returns it. */
export function hasRoute(locale: string, pathname: string): boolean {
  const languages = ROUTE_LANGUAGES[pathname as RouteKey];
  return !languages || languages.includes(getLanguage(locale));
}

/** Locales a route exists in, in the order of `LOCALES`: every one, unless `ROUTE_LANGUAGES` restricts it. */
export function getRouteLocales(routeKey: RouteKey): Locale[] {
  return LOCALES.filter((locale) => hasRoute(locale, routeKey));
}
