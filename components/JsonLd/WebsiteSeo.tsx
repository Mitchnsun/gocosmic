import { JsonLdScript } from 'next-seo';

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
        url: 'https://www.gocosmic.dev',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.gocosmic.dev/search?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}
