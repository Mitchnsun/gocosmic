import { useLocale } from 'next-intl';
import { JsonLdScript } from 'next-seo';

import { getCanonicalUrl } from '@/i18n/canonical';
import { FOUNDER_HOME, FOUNDER_NAME, SITE_URL } from '@/lib/config';

function getJobTitleByLocale(locale: string): string {
  switch (locale) {
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
    case 'en':
    default: {
      return 'Founder of Cosmic Studio, web and mobile developer';
    }
  }
}

export default function PersonSeo() {
  const locale = useLocale();
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
      address: { '@type': 'PostalAddress', ...FOUNDER_HOME },
    },
  };

  return <JsonLdScript data={personJsonLd} scriptKey="person-jsonld" />;
}
