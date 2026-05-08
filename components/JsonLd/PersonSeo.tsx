import { useLocale } from 'next-intl';
import { JsonLdScript } from 'next-seo';

import { getCanonicalUrl } from '@/i18n/canonical';

function getJobTitleByLocale(locale: string): string {
  switch (locale) {
    case 'en': {
      return 'Freelance Web & Mobile Developer';
    }
    case 'es': {
      return 'Desarrollador Web y Móvil Freelance';
    }
    case 'de': {
      return 'Freelancer für Web- und Mobile-Entwicklung';
    }
    case 'it': {
      return 'Sviluppatore Web e Mobile Freelance';
    }
    case 'fr':
    default: {
      return 'Développeur Web & Mobile Freelance';
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
        name: 'Go Cosmic',
        url: 'https://www.gocosmic.dev',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Annecy',
      addressCountry: 'FR',
    },
  };

  return <JsonLdScript data={personJsonLd} scriptKey="person-jsonld" />;
}
