import type { Region } from '@/lib/region';

export const SITE_URL = 'https://www.gocosmic.dev';

/** Studio name, used by the logo, the footer, structured data and outgoing emails. */
export const BRAND_NAME = 'Cosmic Studio';

/** Studio base per region, shown as HUD metadata in the status bar and the mobile menu. */
export const STUDIO_BASES: Record<Region, { city: string; altitude: string }> = {
  fr: { city: 'Annecy', altitude: 'Alt. 447m' },
  ch: { city: 'Chêne-Bougeries', altitude: 'Alt. 424m' },
};
