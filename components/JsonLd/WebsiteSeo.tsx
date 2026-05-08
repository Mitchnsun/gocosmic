import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';

export default function WebsiteSeo() {
  return (
    <JsonLdScript
      scriptKey="website-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        url: SITE_URL,
      }}
    />
  );
}
