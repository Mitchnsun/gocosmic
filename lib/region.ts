/**
 * Business regions the site adapts to.
 *
 * `ch` is served to visitors located in Switzerland: the Geneva base and Swiss
 * francs. `fr` is the fallback for everyone else: the Annecy base and euros.
 * These are ISO 3166-1 country codes, not locales — language and region are
 * independent, so a Swiss visitor may well browse the site in English.
 */
export type Region = 'fr' | 'ch';

/** Doubles as the message key used to pick a price string. */
export type Currency = 'eur' | 'chf';

export const DEFAULT_REGION: Region = 'fr';

export function resolveRegion(countryCode?: string | null): Region {
  return countryCode?.trim().toUpperCase() === 'CH' ? 'ch' : DEFAULT_REGION;
}

export function getCurrency(region: Region): Currency {
  switch (region) {
    case 'ch':
      return 'chf';
    case 'fr':
      return 'eur';
  }
}
