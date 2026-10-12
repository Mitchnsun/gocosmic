import type { NextConfig } from 'next';

// Relative imports: `next.config.ts` loads this module before path aliases exist.
import { getLanguage, getLocalePrefix, type Language, LANGUAGES, LOCALES } from '../i18n/locales';
import { routing } from '../i18n/routing';

type Redirect = Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>[number];

interface RetiredPage {
  /** Former slug per language. */
  slugs: Record<Language, string>;
  /** Section of the Services & pricing page that now holds the content, if any. */
  hash?: string;
}

/**
 * Pages merged away by the Cosmic Studio rebrand, with their former localized
 * slugs. Their content now lives on the Services & pricing page.
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
  // Pricing → the subscription simulator
  {
    hash: '#simulator',
    slugs: {
      en: '/pricing',
      fr: '/tarifs',
      es: '/precios',
      de: '/preise',
      it: '/prezzi',
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
 * Permanent redirects from the retired pages to Services & pricing, in every
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
