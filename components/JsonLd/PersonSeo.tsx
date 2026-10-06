import { useLocale } from 'next-intl';
import { JsonLdScript } from 'next-seo';

import { getCanonicalUrl } from '@/i18n/canonical';
import { BRAND_NAME, FOUNDER_HOME, SITE_URL } from '@/lib/config';

function getJobTitleByLocale(locale: string): string {
  switch (locale) {
    case 'en': {
      return 'Founder of Cosmic Studio, web and mobile developer';
    }
    case 'es': {
      return 'Fundador de Cosmic Studio, desarrollador web y móvil';
    }
    case 'de': {
      return 'Gründer von Cosmic Studio, Web- und App-Entwickler';
    }
    case 'it': {
      return 'Fondatore di Cosmic Studio, sviluppatore web e mobile';
    }
    case 'fr':
    default: {
      return 'Fondateur de Cosmic Studio, développeur web et mobile';
    }
  }
}

export default function PersonSeo() {
  const locale = useLocale();
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matthieu Compérat',
    url: getCanonicalUrl(locale, '/about'),
    jobTitle: getJobTitleByLocale(locale),
    sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
    worksFor: [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#company`,
        name: BRAND_NAME,
        url: SITE_URL,
      },
    ],
    homeLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', ...FOUNDER_HOME },
    },
  };

  return <JsonLdScript data={personJsonLd} scriptKey="person-jsonld" />;
}
