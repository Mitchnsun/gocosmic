import { useLocale } from 'next-intl';

import { getCanonicalUrl } from '@/i18n/canonical';
import { getLanguage } from '@/i18n/locales';
import type { RouteKey } from '@/i18n/routing';
import { FOUNDER_NAME, SITE_URL } from '@/lib/config';

import { JsonLd } from './JsonLd';

interface ArticleSeoProps {
  /** The guide's route. */
  route: RouteKey;
  headline: string;
  description: string;
  /** First publication and latest update, as `YYYY-MM-DD`. */
  datePublished: string;
  dateModified: string;
}

/** A guide as an article written by the founder (the `Person` of `PersonSeo`) and published by the studio. */
export default function ArticleSeo({ route, headline, description, datePublished, dateModified }: ArticleSeoProps) {
  const locale = useLocale();
  const url = getCanonicalUrl(locale, route);

  return (
    <JsonLd
      scriptKey="article-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${url}#article`,
        headline,
        description,
        url,
        mainEntityOfPage: url,
        inLanguage: locale,
        image: `${SITE_URL}/og-default-${getLanguage(locale)}.jpg`,
        datePublished,
        dateModified,
        author: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#person`,
          name: FOUNDER_NAME,
          url: getCanonicalUrl(locale, '/about'),
        },
        publisher: { '@id': `${SITE_URL}/#company` },
      }}
    />
  );
}
