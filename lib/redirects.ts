import type { NextConfig } from 'next';

// Relative imports: `next.config.ts` loads this module before path aliases exist.
import {
  DEFAULT_LANGUAGE,
  getLanguage,
  getLocalePrefix,
  type Language,
  LANGUAGES,
  type Locale,
  LOCALES,
  localeWithLanguage,
} from '../i18n/locales';
import { hasRoute } from '../i18n/route-locales';
import { ROUTE_FALLBACK_LANGUAGES, type RouteKey, routing } from '../i18n/routing';

type Redirect = Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>[number];

interface RetiredPage {
  /** Former slug per language. */
  slugs: Record<Language, string>;
  /** Section of the Services page that now holds the content, if any. */
  hash?: string;
}

/**
 * Pages merged away by the Cosmic Studio rebrand, with their former localized
 * slugs. Their content now lives on the Services page. The former pricing page
 * came back as a page of its own, under the same slugs; its English slug under another prefix
 * (`/fr/pricing`) is redirected by the i18n middleware.
 */
const RETIRED_PAGES: RetiredPage[] = [
  // Offers → the pricing columns
  {
    hash: '#pricing',
    slugs: {
      en: '/offers',
      fr: '/nos-offres',
      es: '/nuestras-ofertas',
      de: '/unsere-angebote',
      it: '/le-nostre-offerte',
    },
  },
  // 3D journey → the page itself
  {
    slugs: {
      en: '/journey',
      fr: '/voyage',
      es: '/viaje',
      de: '/reise',
      it: '/viaggio',
    },
  },
];

/**
 * Permanent redirects from the retired pages to Services, in every
 * language. The English slug is also caught under each language prefix and
 * without any prefix, since older links used both forms. The Swiss URLs came
 * after these pages were retired, so they have nothing to redirect.
 */
export function getLegacyRedirects(): Redirect[] {
  return RETIRED_PAGES.flatMap(({ slugs, hash = '' }) => {
    const english = slugs.en;
    const localized = LANGUAGES.flatMap((language) =>
      [...new Set([slugs[language], english])].map((slug) => ({
        source: `/${language}${slug}`,
        destination: `/${language}${routing.pathnames['/services'][language]}${hash}`,
        permanent: true,
      }))
    );

    return [{ source: english, destination: `/services${hash}`, permanent: true }, ...localized];
  });
}

/** Slugs of the local page before it was retargeted at "website creation" and put Geneva first. */
const FORMER_LOCAL_SLUGS: Record<Language, string> = {
  en: '/web-mobile-developer-annecy-geneva',
  fr: '/developpeur-web-mobile-annecy-geneve',
  es: '/desarrollador-web-movil-annecy-ginebra',
  de: '/web-mobile-entwickler-annecy-genf',
  it: '/sviluppatore-web-mobile-annecy-ginevra',
};

/** Permanent redirects from the former local page slugs to the current ones, under every locale prefix (Swiss ones included). */
export function getLocalPageRedirects(): Redirect[] {
  return LOCALES.map((locale) => {
    const language = getLanguage(locale);
    return {
      source: `${getLocalePrefix(locale)}${FORMER_LOCAL_SLUGS[language]}`,
      destination: `${getLocalePrefix(locale)}${routing.pathnames['/local'][locale]}`,
      permanent: true,
    };
  });
}

/** URL path of a route in a locale, without the domain: `/fr-ch/applications/moi-president/confidentialite`. */
function localizedPath(routeKey: RouteKey, locale: Locale): string {
  const pathnames = routing.pathnames[routeKey];
  return `${getLocalePrefix(locale)}${typeof pathnames === 'string' ? pathnames : pathnames[locale]}`;
}

/**
 * Temporary redirects (307) of the pages published in some languages only whose other languages fall back to
 * English (`ROUTE_FALLBACK_LANGUAGES`): from each locale the page is not published in to the English page in the
 * same region, e.g. `/de/apps/moi-president/impressum` → `/en/apps/moi-president/legal-notice` and
 * `/it-ch/…` → `/en-ch/…`. Temporary, so that a translation can come later without a redirect cached in the way.
 */
export function getFallbackRedirects(): Redirect[] {
  return (Object.keys(ROUTE_FALLBACK_LANGUAGES) as RouteKey[]).flatMap((routeKey) =>
    LOCALES.filter((locale) => !hasRoute(locale, routeKey)).map((locale) => ({
      source: localizedPath(routeKey, locale),
      destination: localizedPath(routeKey, localeWithLanguage(locale, DEFAULT_LANGUAGE)),
      permanent: false,
    }))
  );
}
