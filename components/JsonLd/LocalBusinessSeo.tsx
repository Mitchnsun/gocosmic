import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';

export default function LocalBusinessSeo() {
  return (
    <JsonLdScript
      scriptKey="local-business-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#company`,
        name: 'Go Cosmic',
        description: 'Web and mobile development agency based in Annecy, serving Geneva and Haute-Savoie.',
        url: SITE_URL,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Annecy',
          addressRegion: 'Auvergne-Rhône-Alpes',
          postalCode: '74000',
          addressCountry: 'FR',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 45.8992,
          longitude: 6.1294,
        },
        areaServed: ['Annecy', 'Genève', 'Haute-Savoie'],
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      }}
    />
  );
}
