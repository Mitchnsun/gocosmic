import { vi } from 'vitest';

import ArticleSeo from '@/components/JsonLd/ArticleSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn<(props: unknown) => null>(() => null);

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

describe('ArticleSeo', () => {
  it('declares a guide as an article by the founder, published by the studio, with its dates', () => {
    render(
      <ArticleSeo
        route="/story"
        headline="Our story"
        description="From 2012 to today"
        datePublished="2026-10-01"
        dateModified="2026-10-17"
      />
    );

    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'article-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': 'https://www.gocosmic.dev/en/story#article',
        headline: 'Our story',
        description: 'From 2012 to today',
        url: 'https://www.gocosmic.dev/en/story',
        mainEntityOfPage: 'https://www.gocosmic.dev/en/story',
        inLanguage: 'en',
        image: 'https://www.gocosmic.dev/og-default-en.jpg',
        datePublished: '2026-10-01',
        dateModified: '2026-10-17',
        author: {
          '@type': 'Person',
          '@id': 'https://www.gocosmic.dev/#person',
          name: 'Matthieu Compérat',
          url: 'https://www.gocosmic.dev/en/about',
        },
        publisher: { '@id': 'https://www.gocosmic.dev/#company' },
      },
    });
  });
});
