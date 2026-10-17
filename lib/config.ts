import type { Region } from '@/lib/region';

export const SITE_URL = 'https://www.gocosmic.dev';

/** Studio name, used by the logo, the footer, structured data and outgoing emails. */
export const BRAND_NAME = 'Cosmic Studio';

/** Former studio name, still declared to search engines as an alternate name. */
export const LEGACY_BRAND_NAME = 'Go Cosmic';

/** Founder of the studio, declared as a person in structured data. */
export const FOUNDER_NAME = 'Matthieu Compérat';

/** Creation date of the studio's first business, the EIRL of 17 October 2016, told on the story page. */
export const FOUNDING_DATE = '2016-10-17';

/** Public contact address, shown on the contact page and declared in structured data. */
export const CONTACT_EMAIL = 'contact@gocosmic.dev';

/** Support address for existing clients, shown on the contact page. */
export const SUPPORT_EMAIL = 'support@gocosmic.dev';

/** Business address declared in structured data, at the town level; the legal notice gives the street. */
export const STUDIO_ADDRESS = {
  addressLocality: 'Chêne-Bougeries',
  postalCode: '1224',
  addressRegion: 'GE',
  addressCountry: 'CH',
} as const;

/** Studio base per region, shown as HUD metadata in the status bar and the mobile menu. */
export const STUDIO_BASES: Record<Region, { city: string; altitude: string }> = {
  fr: { city: 'Annecy', altitude: 'Alt. 447m' },
  ch: { city: 'Chêne-Bougeries', altitude: 'Alt. 424m' },
};
