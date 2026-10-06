import type { Region } from '@/lib/region';

export const SITE_URL = 'https://www.gocosmic.dev';

/** Studio name, used by the logo, the footer, structured data and outgoing emails. */
export const BRAND_NAME = 'Cosmic Studio';

/** Former studio name, still declared to search engines as an alternate name. */
export const LEGACY_BRAND_NAME = 'Go Cosmic';

/** Founder of the studio, declared as a person in structured data. */
export const FOUNDER_NAME = 'Matthieu Compérat';

/** Public contact address, shown on the contact page and declared in structured data. */
export const CONTACT_EMAIL = 'contact@gocosmic.dev';

/** Registration facts of the sole-trader business, as on the legal notice. */
export const COMPANY_REGISTRATION = {
  foundingDate: '2016-10-17',
  siret: '82320036500026',
} as const;

/** Registered office declared in structured data, at the town level, as on the legal notice. */
export const STUDIO_ADDRESS = {
  addressLocality: 'Duingt',
  postalCode: '74410',
  addressRegion: 'Auvergne-Rhône-Alpes',
  addressCountry: 'FR',
} as const;

/** Where the founder lives, declared as his home location in structured data. */
export const FOUNDER_HOME = {
  addressLocality: 'Chêne-Bougeries',
  addressCountry: 'CH',
} as const;

/** Studio base per region, shown as HUD metadata in the status bar and the mobile menu. */
export const STUDIO_BASES: Record<Region, { city: string; altitude: string }> = {
  fr: { city: 'Annecy', altitude: 'Alt. 447m' },
  ch: { city: 'Chêne-Bougeries', altitude: 'Alt. 424m' },
};
