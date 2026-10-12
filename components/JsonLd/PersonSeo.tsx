import { useLocale } from 'next-intl';

import { getCanonicalUrl } from '@/i18n/canonical';
import { getLanguage } from '@/i18n/locales';
import { FOUNDER_NAME, SITE_URL, STUDIO_ADDRESS } from '@/lib/config';

import { JsonLd } from './JsonLd';

function getJobTitleByLocale(locale: string): string {
  switch (getLanguage(locale)) {
    case 'es': {
      return 'Fundador de Cosmic Studio, desarrollador web y móvil';
    }
    case 'de': {
      return 'Gründer von Cosmic Studio, Web- und App-Entwickler';
    }
    case 'it': {
      return 'Fondatore di Cosmic Studio, sviluppatore web e mobile';
    }
    case 'fr': {
      return 'Fondateur de Cosmic Studio, développeur web et mobile';
    }
    case 'en': {
      return 'Founder of Cosmic Studio, web and mobile developer';
    }
  }
}

export default function PersonSeo() {
  const locale = useLocale();
  const { addressLocality, addressCountry } = STUDIO_ADDRESS;
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: FOUNDER_NAME,
    url: getCanonicalUrl(locale, '/about'),
    jobTitle: getJobTitleByLocale(locale),
    sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
    // The studio itself is described once, by LocalBusinessSeo in the layout.
    worksFor: { '@id': `${SITE_URL}/#company` },
    homeLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality, addressCountry },
    },
  };

  return <JsonLd data={personJsonLd} scriptKey="person-jsonld" />;
}
