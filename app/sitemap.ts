import { type MetadataRoute } from 'next';

import { getCanonicalUrl, getLanguageAlternates } from '@/i18n/canonical';
import { routing } from '@/i18n/routing';

type RouteKey = keyof typeof routing.pathnames;

/** Internal pages kept out of search engines (they are also noindex). */
export const UNLISTED_ROUTES: readonly RouteKey[] = ['/design-system'];

/** One entry per route and locale, each listing its translations as hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const listed = (Object.keys(routing.pathnames) as RouteKey[]).filter(
    (routeKey) => !UNLISTED_ROUTES.includes(routeKey)
  );

  return listed.flatMap((routeKey) => {
    const languages = getLanguageAlternates(routeKey);

    return routing.locales.map((locale) => ({
      url: getCanonicalUrl(locale, routeKey),
      lastModified,
      alternates: { languages },
    }));
  });
}
