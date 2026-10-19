import sitemap from '@/app/sitemap';

// The story page stands in for a page published in French only.
vi.mock('@/i18n/routing', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n/routing')>()),
  ROUTE_LANGUAGES: { '/story': ['fr'] },
}));

describe('sitemap of a page published in some languages only', () => {
  it('lists the page in its language only, Swiss version included', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining(['https://www.gocosmic.dev/fr/histoire', 'https://www.gocosmic.dev/fr-ch/histoire'])
    );
    expect(urls.some((url) => /\/(story|historia|geschichte|storia)$/.test(url))).toBe(false);
  });

  it('declares no hreflang to a version that does not exist, and points x-default to French', () => {
    const story = sitemap().find((entry) => entry.url === 'https://www.gocosmic.dev/fr/histoire');

    expect(story?.alternates?.languages).toEqual({
      fr: 'https://www.gocosmic.dev/fr/histoire',
      'fr-CH': 'https://www.gocosmic.dev/fr-ch/histoire',
      'x-default': 'https://www.gocosmic.dev/fr/histoire',
    });
  });

  it('keeps every other page in every version', () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining(['https://www.gocosmic.dev/en/about', 'https://www.gocosmic.dev/it-ch'])
    );
  });
});
