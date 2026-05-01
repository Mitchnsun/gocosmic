import { type MetadataRoute } from 'next';

import { routing } from '@/i18n/routing';

const BASE_URL = 'https://www.gocosmic.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const { locales, pathnames } = routing;

  const lastModified = new Date();

  return Object.entries(pathnames).flatMap(([, localePaths]) =>
    locales.map((locale) => {
      const localizedPath =
        typeof localePaths === 'string'
          ? localePaths
          : (new Map(Object.entries(localePaths as Record<string, string>)).get(locale) ?? '/');

      const url = localizedPath === '/' ? `${BASE_URL}/${locale}/` : `${BASE_URL}/${locale}${localizedPath}`;

      return { url, lastModified };
    })
  );
}
