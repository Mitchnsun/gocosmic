import { headers } from 'next/headers';

import { type Region, resolveRegion } from './region';

/** Visitor country resolved by the Vercel edge network. */
const COUNTRY_HEADER = 'x-vercel-ip-country';

/**
 * Region of the current request, for use in server components.
 * Falls back to the default region when the header is absent (local dev,
 * self-hosted runs) or names any country other than Switzerland.
 */
export async function getRegion(): Promise<Region> {
  const headerList = await headers();
  return resolveRegion(headerList.get(COUNTRY_HEADER));
}
