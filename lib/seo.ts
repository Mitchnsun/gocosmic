import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { getAlternates } from '@/i18n/canonical';
import { getLanguage, type Locale } from '@/i18n/locales';
import { routing } from '@/i18n/routing';
import { BRAND_NAME } from '@/lib/config';

type RouteKey = keyof typeof routing.pathnames;

/** Open Graph locale of each site locale (`language_TERRITORY`). */
export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  it: 'it_IT',
  'en-CH': 'en_CH',
  'fr-CH': 'fr_CH',
  'es-CH': 'es_CH',
  'de-CH': 'de_CH',
  'it-CH': 'it_CH',
};

/** Size of every social image in `public/`. */
const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

interface PageMetadataInput {
  locale: string;
  routeKey: RouteKey;
  title: string;
  description: string;
  /** `article` for case studies, `website` otherwise. */
  type?: 'website' | 'article';
  robots?: Metadata['robots'];
}

/**
 * Full metadata of a page: title, description, canonical and hreflang links, and the Open Graph and
 * Twitter blocks. A page's `openGraph` replaces the layout's instead of merging with it, so every
 * page builds the whole block here.
 */
export async function buildPageMetadata({
  locale,
  routeKey,
  title,
  description,
  type = 'website',
  robots,
}: PageMetadataInput): Promise<Metadata> {
  const safeLocale: Locale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'og' });
  const alternates = getAlternates(safeLocale, routeKey);
  // A Swiss locale shares its language's social images.
  const language = getLanguage(safeLocale);
  const alt = t('image_alt');

  return {
    title,
    description,
    alternates,
    ...(robots && { robots }),
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      type,
      siteName: BRAND_NAME,
      locale: OG_LOCALES[safeLocale],
      alternateLocale: routing.locales.filter((other) => other !== safeLocale).map((other) => OG_LOCALES[other]),
      images: [{ url: `/og-default-${language}.jpg`, ...OG_IMAGE_SIZE, alt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: `/twitter-card-${language}.jpg`, alt }],
    },
  };
}
