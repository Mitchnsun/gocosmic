import type { NextConfig } from 'next';

import type { Locale } from '@/i18n/canonical';
import { routing } from '@/i18n/routing';

type Redirect = Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>[number];

/** Localized slug of the Services & pricing page, read from `i18n/routing.ts`. */
const SERVICES_PATHS: Array<[Locale, string]> = routing.locales.map((locale) => [
  locale,
  // eslint-disable-next-line security/detect-object-injection -- locale is the typed Locale union
  routing.pathnames['/services'][locale],
]);

interface RetiredPage {
  /** Former slug per locale. */
  slugs: Map<Locale, string>;
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
    slugs: new Map([
      ['en', '/offers'],
      ['fr', '/nos-offres'],
      ['es', '/nuestras-ofertas'],
      ['de', '/unsere-angebote'],
      ['it', '/le-nostre-offerte'],
    ]),
  },
  // Pricing → the subscription simulator
  {
    hash: '#simulator',
    slugs: new Map([
      ['en', '/pricing'],
      ['fr', '/tarifs'],
      ['es', '/precios'],
      ['de', '/preise'],
      ['it', '/prezzi'],
    ]),
  },
  // 3D journey → the page itself
  {
    slugs: new Map([
      ['en', '/journey'],
      ['fr', '/voyage'],
      ['es', '/viaje'],
      ['de', '/reise'],
      ['it', '/viaggio'],
    ]),
  },
];

/**
 * Permanent redirects from the retired pages to Services & pricing, in every
 * locale. The English slug is also caught under each locale prefix and without
 * any prefix, since older links used both forms.
 */
export function getLegacyRedirects(): Redirect[] {
  return RETIRED_PAGES.flatMap(({ slugs, hash = '' }) => {
    const english = slugs.get('en') ?? '';
    const localized = SERVICES_PATHS.flatMap(([locale, servicesPath]) =>
      [...new Set([slugs.get(locale) ?? english, english])].map((slug) => ({
        source: `/${locale}${slug}`,
        destination: `/${locale}${servicesPath}${hash}`,
        permanent: true,
      }))
    );

    return [{ source: english, destination: `/services${hash}`, permanent: true }, ...localized];
  });
}
