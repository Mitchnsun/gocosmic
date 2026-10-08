import { headers } from 'next/headers';
import { getLocale } from 'next-intl/server';

import { isSwissLocale } from '@/i18n/locales';

import { type Region, resolveRegion } from './region';

/** Visitor country resolved by the Vercel edge network. */
const COUNTRY_HEADER = 'x-vercel-ip-country';

/**
 * Region of the current request, for use in server components.
 * A Swiss locale (`/fr-ch`…) always shows the Swiss region, so search engines
 * index that content whatever country they crawl from. A language-only locale
 * follows the visitor's country, and falls back to the default region when the
 * header is absent (local dev, self-hosted runs) or names any country other
 * than Switzerland.
 */
export async function getRegion(): Promise<Region> {
  if (isSwissLocale(await getLocale())) return 'ch';

  const headerList = await headers();
  return resolveRegion(headerList.get(COUNTRY_HEADER));
}
