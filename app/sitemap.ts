import { type MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';

const BASE_URL = 'https://www.gocosmic.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales, pathnames } = routing;

  const lastModified = new Date();

  return Object.entries(pathnames).flatMap(([routeKey, localePaths]) =>
    locales.map((locale) => {
      let localizedPath: string;

      if (typeof localePaths === 'string') {
        localizedPath = localePaths;
      } else {
        const perLocale = localePaths as Record<string, string>;
        const entry = Object.entries(perLocale).find(([key]) => key === locale);
        if (!entry) {
          throw new Error(
            `Sitemap: missing locale "${locale}" for route "${routeKey}". Update i18n/routing.ts to add the missing entry.`
          );
        }
        localizedPath = entry[1];
      }

      const url = localizedPath === '/' ? `${BASE_URL}/${locale}/` : `${BASE_URL}/${locale}${localizedPath}`;

      return { url, lastModified };
    })
  );
}
