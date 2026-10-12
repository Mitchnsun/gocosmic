import { LANGUAGES } from '@/i18n/locales';
import { BRAND_NAME, LEGACY_BRAND_NAME, SITE_URL } from '@/lib/config';

import { JsonLd } from './JsonLd';

/**
 * The site itself: its name (shown by search engines next to results), its languages and its publisher.
 * Same values on every page, since the `@id` names one entity.
 */
export default function WebsiteSeo() {
  return (
    <JsonLd
      scriptKey="website-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: BRAND_NAME,
        alternateName: LEGACY_BRAND_NAME,
        // Languages only: the Swiss locales (`fr-CH`…) carry the same languages.
        inLanguage: LANGUAGES,
        publisher: { '@id': `${SITE_URL}/#company` },
      }}
    />
  );
}
