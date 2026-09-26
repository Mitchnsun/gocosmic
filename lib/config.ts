import type { Region } from '@/lib/region';

export const SITE_URL = 'https://www.gocosmic.dev';

/** Studio name, used by the logo, the footer, structured data and outgoing emails. */
export const BRAND_NAME = 'Cosmic Studio';

/** Former studio name, still declared to search engines as an alternate name. */
export const LEGACY_BRAND_NAME = 'Go Cosmic';

/** Studio base declared in structured data. Coordinates are approximate, at the town level. */
export const STUDIO_ADDRESS = {
  addressLocality: 'Chêne-Bougeries',
  postalCode: '1224',
  addressRegion: 'GE',
  addressCountry: 'CH',
  geo: { latitude: 46.195, longitude: 6.186 },
} as const;

/** Studio base per region, shown as HUD metadata in the status bar and the mobile menu. */
export const STUDIO_BASES: Record<Region, { city: string; altitude: string }> = {
  fr: { city: 'Annecy', altitude: 'Alt. 447m' },
  ch: { city: 'Chêne-Bougeries', altitude: 'Alt. 424m' },
};
