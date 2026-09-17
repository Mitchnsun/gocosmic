import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';

type LocalBusinessSeoProps = {
  locale: string;
};

function getLocalizedLocalBusinessData(locale: string) {
  switch (locale) {
    case 'fr': {
      return {
        description:
          'Agence de développement web et mobile basée à Annecy, intervenant à Genève, en Suisse romande et en Haute-Savoie.',
        areaServed: ['Annecy', 'Genève', 'Haute-Savoie', 'Arc lémanique', 'Suisse romande'],
        inLanguage: 'fr',
      };
    }
    case 'es': {
      return {
        description:
          'Agencia de desarrollo web y móvil con sede en Annecy, que presta servicios en Ginebra, la Suiza romanda y Alta Saboya.',
        areaServed: ['Annecy', 'Ginebra', 'Alta Saboya', 'Arco lemánico', 'Suiza romanda'],
        inLanguage: 'es',
      };
    }
    case 'de': {
      return {
        description:
          'Agentur für Web- und Mobile-Entwicklung mit Sitz in Annecy, tätig in Genf, der Westschweiz und Hochsavoyen.',
        areaServed: ['Annecy', 'Genf', 'Hochsavoyen', 'Genferseeregion', 'Westschweiz'],
        inLanguage: 'de',
      };
    }
    case 'it': {
      return {
        description:
          'Agenzia di sviluppo web e mobile con sede ad Annecy, attiva a Ginevra, nella Svizzera romanda e nell’Alta Savoia.',
        areaServed: ['Annecy', 'Ginevra', 'Alta Savoia', 'Arco lemanico', 'Svizzera romanda'],
        inLanguage: 'it',
      };
    }
    case 'en':
    default: {
      return {
        description:
          'Web and mobile development agency based in Annecy, serving Geneva, French-speaking Switzerland and Haute-Savoie.',
        areaServed: ['Annecy', 'Geneva', 'Haute-Savoie', 'Lake Geneva region', 'French-speaking Switzerland'],
        inLanguage: 'en',
      };
    }
  }
}

export default function LocalBusinessSeo({ locale }: LocalBusinessSeoProps) {
  const { description, areaServed, inLanguage } = getLocalizedLocalBusinessData(locale);

  return (
    <JsonLdScript
      scriptKey="local-business-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#company`,
        name: 'Go Cosmic',
        description,
        url: SITE_URL,
        inLanguage,
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
        areaServed,
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      }}
    />
  );
}
