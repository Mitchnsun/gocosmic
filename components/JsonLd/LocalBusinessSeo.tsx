import { JsonLdScript } from 'next-seo';

import { SITE_URL } from '@/i18n/canonical';
import { getLanguage } from '@/i18n/locales';
import { BRAND_NAME, CONTACT_EMAIL, FOUNDER_NAME, LEGACY_BRAND_NAME, STUDIO_ADDRESS } from '@/lib/config';

type LocalBusinessSeoProps = {
  locale: string;
};

/*
 * The studio is declared at its Geneva base, while Annecy stays named in the
 * description and the served areas for local searches on the French side.
 */
function getLocalizedLocalBusinessData(locale: string) {
  switch (getLanguage(locale)) {
    case 'fr': {
      return {
        description:
          'Studio web et mobile installé à Chêne-Bougeries, près de Genève. Sites et applications pour les artisans, associations et indépendants de Suisse romande et de Haute-Savoie, notamment à Annecy.',
        areaServed: ['Genève', 'Suisse romande', 'Haute-Savoie', 'Annecy'],
      };
    }
    case 'es': {
      return {
        description:
          'Estudio web y móvil con sede en Chêne-Bougeries, cerca de Ginebra. Sitios web y aplicaciones para artesanos, asociaciones y profesionales independientes de la Suiza romanda y la Alta Saboya, en particular en Annecy.',
        areaServed: ['Ginebra', 'Suiza romanda', 'Alta Saboya', 'Annecy'],
      };
    }
    case 'de': {
      return {
        description:
          'Web- und App-Studio in Chêne-Bougeries bei Genf. Websites und Apps für Handwerksbetriebe, Vereine und Selbstständige in der Westschweiz und in Hochsavoyen, insbesondere in Annecy.',
        areaServed: ['Genf', 'Westschweiz', 'Hochsavoyen', 'Annecy'],
      };
    }
    case 'it': {
      return {
        description:
          'Studio web e mobile con sede a Chêne-Bougeries, vicino a Ginevra. Siti e app per artigiani, associazioni e liberi professionisti della Svizzera romanda e dell’Alta Savoia, in particolare ad Annecy.',
        areaServed: ['Ginevra', 'Svizzera romanda', 'Alta Savoia', 'Annecy'],
      };
    }
    case 'en': {
      return {
        description:
          'Web and mobile studio based in Chêne-Bougeries, near Geneva. Websites and apps for craftspeople, associations and independents in French-speaking Switzerland and Haute-Savoie, including Annecy.',
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
        url: SITE_URL,
        image: `${SITE_URL}/og-default.jpg`,
        email: CONTACT_EMAIL,
        founder: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: FOUNDER_NAME },
        address: { '@type': 'PostalAddress', ...STUDIO_ADDRESS },
        areaServed,
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      }}
    />
  );
}
