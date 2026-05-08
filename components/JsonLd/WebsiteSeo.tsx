import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';

type WebsiteSeoProps = {
  isSearchEnabled: boolean;
};

export default function WebsiteSeo({ isSearchEnabled }: WebsiteSeoProps) {
  if (!isSearchEnabled) {
    return null;
  }

  return (
    <JsonLdScript
      scriptKey="website-sitelinks-searchbox"
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}
