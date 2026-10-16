import type { NextConfig } from 'next';

// Relative imports: `next.config.ts` loads this module before path aliases exist.
import { getLanguage, getLocalePrefix, type Language, LANGUAGES, LOCALES } from '../i18n/locales';
import { routing } from '../i18n/routing';

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
 * came back as a page of its own, under the same slugs (see `getEnglishSlugRedirects`).
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

/** Pages whose English slug older links also used under the other language prefixes, e.g. `/fr/pricing`. */
const ENGLISH_SLUG_PAGES = ['/pricing'] as const;

/**
 * Permanent redirects from a page's English slug under another prefix to its slug in that language
 * (`/fr/pricing` → `/fr/tarifs`), Swiss prefixes included. Without them, the i18n middleware would
 * only answer with a temporary redirect.
 */
export function getEnglishSlugRedirects(): Redirect[] {
  return ENGLISH_SLUG_PAGES.flatMap((page) =>
    LOCALES.flatMap((locale) => {
      const english = routing.pathnames[page].en;
      const slug = routing.pathnames[page][locale];
      const prefix = getLocalePrefix(locale);
      return slug === english
        ? []
        : [{ source: `${prefix}${english}`, destination: `${prefix}${slug}`, permanent: true }];
    })
  );
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
