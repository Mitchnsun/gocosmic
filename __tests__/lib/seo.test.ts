import { createTranslator } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { buildPageMetadata, OG_LOCALES } from '@/lib/seo';

vi.mock('next-intl/server', () => ({
  getTranslations: async ({ locale, namespace }: { locale: string; namespace: string }) => {
    const { MESSAGES_BY_LOCALE } = await import('../messages-by-locale');
    // eslint-disable-next-line security/detect-object-injection
    return createTranslator({ locale, messages: MESSAGES_BY_LOCALE[locale], namespace });
  },
}));

describe('buildPageMetadata', () => {
  it('builds the canonical, hreflang, Open Graph and Twitter blocks of a page', async () => {
    const metadata = await buildPageMetadata({
      locale: 'fr',
      routeKey: '/about',
      title: 'Title',
      description: 'Description',
    });

    expect(metadata.title).toBe('Title');
    expect(metadata.description).toBe('Description');
    expect(metadata.alternates?.canonical).toBe('https://www.gocosmic.dev/fr/a-propos');
    expect(metadata.alternates?.languages).toMatchObject({ 'x-default': 'https://www.gocosmic.dev/en/about' });
    expect(metadata.robots).toBeUndefined();
    expect(metadata.openGraph).toEqual({
      title: 'Title',
      description: 'Description',
      url: 'https://www.gocosmic.dev/fr/a-propos',
      type: 'website',
      siteName: 'Cosmic Studio',
      locale: 'fr_FR',
      alternateLocale: ['en_US', 'es_ES', 'de_DE', 'it_IT'],
      images: [
        {
          url: '/og-default-fr.jpg',
          width: 1200,
          height: 630,
          alt: 'Cosmic Studio · Votre activité mérite d’être vue.',
        },
      ],
    });
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Title',
      description: 'Description',
      images: [{ url: '/twitter-card-fr.jpg', alt: 'Cosmic Studio · Votre activité mérite d’être vue.' }],
    });
  });

  it('passes the article type and the robots directives through', async () => {
    const metadata = await buildPageMetadata({
      locale: 'en',
      routeKey: '/terms',
      title: 'Terms',
      description: 'Terms of sale',
      type: 'article',
      robots: { index: false, follow: true },
    });

    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.openGraph).toMatchObject({ type: 'article', url: 'https://www.gocosmic.dev/en/terms' });
  });

  it('falls back to the default locale for an unknown one', async () => {
    const metadata = await buildPageMetadata({ locale: 'ja', routeKey: '/', title: 'T', description: 'D' });

    expect(metadata.alternates?.canonical).toBe('https://www.gocosmic.dev/en');
    expect(metadata.openGraph).toMatchObject({ locale: 'en_US' });
  });

  it('maps every site locale to an Open Graph locale', () => {
    expect(Object.keys(OG_LOCALES)).toEqual(['en', 'fr', 'es', 'de', 'it']);
  });
});
