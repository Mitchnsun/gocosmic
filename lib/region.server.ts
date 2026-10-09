import { getLocale } from 'next-intl/server';

import { isSwissLocale } from '@/i18n/locales';

import { DEFAULT_REGION, type Region } from './region';

/**
 * Region of the current request, for use in server components. The URL
 * decides: a Swiss locale (`/fr-ch`…) shows the Swiss region, any other locale
 * the default one. Search engines therefore index each version as visitors see
 * it, and the footer switch always matches the page. The visitor's country only
 * picks the version they land on when the URL has no locale (see `proxy.ts`).
 */
export async function getRegion(): Promise<Region> {
  return isSwissLocale(await getLocale()) ? 'ch' : DEFAULT_REGION;
}
