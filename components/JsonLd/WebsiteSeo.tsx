import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';
import { BRAND_NAME, LEGACY_BRAND_NAME } from '@/lib/config';

type WebsiteSeoProps = {
  locale: string;
};

/** The site itself: its name (shown by search engines next to results) and its publisher. */
export default function WebsiteSeo({ locale }: WebsiteSeoProps) {
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
        inLanguage: locale,
        publisher: { '@id': `${SITE_URL}/#company` },
      }}
    />
  );
}
