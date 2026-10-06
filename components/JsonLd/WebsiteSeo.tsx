import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';
import { routing } from '@/i18n/routing';
import { BRAND_NAME, LEGACY_BRAND_NAME } from '@/lib/config';

/**
 * The site itself: its name (shown by search engines next to results), its languages and its publisher.
 * Same values on every page, since the `@id` names one entity.
 */
export default function WebsiteSeo() {
  return (
    <JsonLdScript
      scriptKey="website-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        alternateName: LEGACY_BRAND_NAME,
        inLanguage: routing.locales,
        publisher: { '@id': `${SITE_URL}/#company` },
      }}
    />
  );
}
