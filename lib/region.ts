/**
 * Business regions the site adapts to.
 *
 * `ch` is shown on the Swiss URLs (`/fr-ch`…): the Geneva base and Swiss
 * francs. `fr` is shown on every other URL: the Annecy base and euros. These
 * are ISO 3166-1 country codes, not locales — language and region are
 * independent, so a Swiss visitor may well browse the site in English.
 */
export type Region = 'fr' | 'ch';

/** Doubles as the message key used to pick a price string. */
export type Currency = 'eur' | 'chf';

export const DEFAULT_REGION: Region = 'fr';

/** Region of a visitor's country, used to pick the version of the site they land on. */
export function resolveRegion(countryCode?: string | null): Region {
  return countryCode?.trim().toUpperCase() === 'CH' ? 'ch' : DEFAULT_REGION;
}

export function getCurrency(region: Region): Currency {
  return region === 'ch' ? 'chf' : 'eur';
}
