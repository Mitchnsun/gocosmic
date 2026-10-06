import type { NextConfig } from 'next';

// Relative imports: `next.config.ts` loads this module before path aliases exist.
import type { Locale } from '../i18n/canonical';
import { routing } from '../i18n/routing';

type Redirect = Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>[number];

interface RetiredPage {
  /** Former slug per locale. */
  slugs: Record<Locale, string>;
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
 * locale. The English slug is also caught under each locale prefix and without
 * any prefix, since older links used both forms.
 */
export function getLegacyRedirects(): Redirect[] {
  return RETIRED_PAGES.flatMap(({ slugs, hash = '' }) => {
    const english = slugs.en;
    /* eslint-disable security/detect-object-injection -- locale is the typed Locale union */
    const localized = routing.locales.flatMap((locale) =>
      [...new Set([slugs[locale], english])].map((slug) => ({
        source: `/${locale}${slug}`,
        destination: `/${locale}${routing.pathnames['/services'][locale]}${hash}`,
        permanent: true,
      }))
    );
    /* eslint-enable security/detect-object-injection */

    return [{ source: english, destination: `/services${hash}`, permanent: true }, ...localized];
  });
}
