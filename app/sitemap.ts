import { type MetadataRoute } from 'next';

import { getCanonicalUrl, getLanguageAlternates } from '@/i18n/canonical';
import { routing } from '@/i18n/routing';

type RouteKey = keyof typeof routing.pathnames;

/** Internal and legal pages kept out of search engines (they are also noindex). */
export const UNLISTED_ROUTES: readonly RouteKey[] = ['/design-system', '/privacy', '/legal-notice', '/terms'];

/** Date of the deployment, set in `next.config.ts`; falls back to now outside a Next build (tests). */
function getLastModified(): Date {
  const buildDate = process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE) : undefined;
  return buildDate && !Number.isNaN(buildDate.getTime()) ? buildDate : new Date();
}

/** One entry per route and locale, each listing its translations as hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = getLastModified();

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
