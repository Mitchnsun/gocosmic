import { JsonLdScript } from 'next-seo';

import { getCanonicalUrl, SITE_URL } from '@/i18n/canonical';
import {
  BRAND_NAME,
  COMPANY_REGISTRATION,
  CONTACT_EMAIL,
  FOUNDER_NAME,
  LEGACY_BRAND_NAME,
  STUDIO_ADDRESS,
} from '@/lib/config';

type LocalBusinessSeoProps = {
  locale: string;
};

/*
 * The studio is declared at its registered office in Duingt, on Lake Annecy, while Geneva and
 * French-speaking Switzerland stay named in the description and the served areas.
 */
function getLocalizedLocalBusinessData(locale: string) {
  switch (locale) {
    case 'fr': {
      return {
        description:
          'Studio web et mobile basé à Duingt, au bord du lac d’Annecy. Sites et applications pour les artisans, associations et indépendants de Haute-Savoie, de Genève et de Suisse romande.',
        areaServed: ['Genève', 'Suisse romande', 'Haute-Savoie', 'Annecy'],
      };
    }
    case 'es': {
      return {
        description:
          'Estudio web y móvil con sede en Duingt, a orillas del lago de Annecy. Sitios web y aplicaciones para artesanos, asociaciones y profesionales independientes de la Alta Saboya, Ginebra y la Suiza romanda.',
        areaServed: ['Ginebra', 'Suiza romanda', 'Alta Saboya', 'Annecy'],
      };
    }
    case 'de': {
      return {
        description:
          'Web- und App-Studio in Duingt am Annecy-See. Websites und Apps für Handwerksbetriebe, Vereine und Selbstständige in Hochsavoyen, Genf und der Westschweiz.',
        areaServed: ['Genf', 'Westschweiz', 'Hochsavoyen', 'Annecy'],
      };
    }
    case 'it': {
      return {
        description:
          'Studio web e mobile con sede a Duingt, sulle rive del lago di Annecy. Siti e app per artigiani, associazioni e liberi professionisti dell’Alta Savoia, di Ginevra e della Svizzera romanda.',
        areaServed: ['Ginevra', 'Svizzera romanda', 'Alta Savoia', 'Annecy'],
      };
    }
    case 'en':
    default: {
      return {
        description:
          'Web and mobile studio based in Duingt, on the shores of Lake Annecy. Websites and apps for craftspeople, associations and independents in Haute-Savoie, Geneva and French-speaking Switzerland.',
        areaServed: ['Geneva', 'French-speaking Switzerland', 'Haute-Savoie', 'Annecy'],
      };
    }
  }
}

export default function LocalBusinessSeo({ locale }: LocalBusinessSeoProps) {
  const { description, areaServed } = getLocalizedLocalBusinessData(locale);

  return (
    <JsonLdScript
      scriptKey="local-business-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#company`,
        name: BRAND_NAME,
        alternateName: LEGACY_BRAND_NAME,
        description,
        url: getCanonicalUrl(locale, '/'),
        image: `${SITE_URL}/og-default.jpg`,
        email: CONTACT_EMAIL,
        foundingDate: COMPANY_REGISTRATION.foundingDate,
        identifier: { '@type': 'PropertyValue', propertyID: 'SIRET', value: COMPANY_REGISTRATION.siret },
        founder: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: FOUNDER_NAME },
        address: { '@type': 'PostalAddress', ...STUDIO_ADDRESS },
        areaServed,
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      }}
    />
  );
}
