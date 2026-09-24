import type { NextConfig } from 'next';

type Redirect = Awaited<ReturnType<NonNullable<NextConfig['redirects']>>>[number];
type Locale = 'en' | 'fr' | 'es' | 'de' | 'it';

/** Localized slug of the Services & pricing page, mirroring `i18n/routing.ts`. */
const SERVICES_PATHS: Array<[Locale, string]> = [
  ['en', '/services'],
  ['fr', '/services'],
  ['es', '/servicios'],
  ['de', '/dienstleistungen'],
  ['it', '/servizi'],
];

/**
 * Pages merged away by the Cosmic Studio rebrand, with their former localized
 * slugs. Their content now lives on the Services & pricing page.
 */
const RETIRED_PAGES: Array<Map<Locale, string>> = [
  // Offers
  new Map([
    ['en', '/offers'],
    ['fr', '/nos-offres'],
    ['es', '/nuestras-ofertas'],
    ['de', '/unsere-angebote'],
    ['it', '/le-nostre-offerte'],
  ]),
  // Pricing
  new Map([
    ['en', '/pricing'],
    ['fr', '/tarifs'],
    ['es', '/precios'],
    ['de', '/preise'],
    ['it', '/prezzi'],
  ]),
  // 3D journey
  new Map([
    ['en', '/journey'],
    ['fr', '/voyage'],
    ['es', '/viaje'],
    ['de', '/reise'],
    ['it', '/viaggio'],
  ]),
];

/**
 * Permanent redirects from the retired pages to Services & pricing, in every
 * locale. The English slug is also caught under each locale prefix and without
 * any prefix, since older links used both forms.
 */
export function getLegacyRedirects(): Redirect[] {
  return RETIRED_PAGES.flatMap((slugs) => {
    const english = slugs.get('en') ?? '';
    const localized = SERVICES_PATHS.flatMap(([locale, servicesPath]) =>
      [...new Set([slugs.get(locale) ?? english, english])].map((slug) => ({
        source: `/${locale}${slug}`,
        destination: `/${locale}${servicesPath}`,
        permanent: true,
      }))
    );

    return [{ source: english, destination: '/services', permanent: true }, ...localized];
  });
}
