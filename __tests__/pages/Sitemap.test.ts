import sitemap from '@/app/sitemap';
import { routing } from '@/i18n/routing';

describe('sitemap', () => {
  it('should return an array of sitemap entries', () => {
    const result = sitemap();

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should generate entries for all locales and routes', () => {
    const result = sitemap();
    const { locales, pathnames } = routing;
    const routeCount = Object.keys(pathnames).length;

    expect(result).toHaveLength(locales.length * routeCount);
  });

  it('should include all locales for each route', () => {
    const result = sitemap();
    const { locales, pathnames } = routing;

    for (const [routeKey, localePaths] of Object.entries(pathnames)) {
      for (const locale of locales) {
        let localizedPath: string;

        if (typeof localePaths === 'string') {
          localizedPath = localePaths;
        } else {
          const entry = Object.entries(localePaths as Record<string, string>).find(([key]) => key === locale);
          expect(entry, `Route "${routeKey}" is missing locale "${locale}" in i18n/routing.ts`).toBeDefined();
          localizedPath = entry![1];
        }

        const expectedUrl =
          localizedPath === '/'
            ? `https://www.gocosmic.dev/${locale}/`
            : `https://www.gocosmic.dev/${locale}${localizedPath}`;

        expect(result.some((entry) => entry.url === expectedUrl)).toBe(true);
      }
    }
  });

  it('should use the correct base URL', () => {
    const result = sitemap();

    for (const entry of result) {
      expect(entry.url).toMatch(/^https:\/\/www\.gocosmic\.dev\//);
    }
  });

  it('should include a lastModified date for each entry', () => {
    const result = sitemap();

    for (const entry of result) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it('should generate correct URL for home page across all locales', () => {
    const result = sitemap();

    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/en/')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/fr/')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/es/')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/de/')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/it/')).toBe(true);
  });

  it('should generate localized URLs for translated routes', () => {
    const result = sitemap();

    // About page — each locale has its own path
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/en/about')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/fr/a-propos')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/es/acerca-de')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/de/ueber-uns')).toBe(true);
    expect(result.some((entry) => entry.url === 'https://www.gocosmic.dev/it/chi-siamo')).toBe(true);
  });
});
