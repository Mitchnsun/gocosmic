'use client';

import { useLocale } from 'next-intl';
import { JsonLdScript } from 'next-seo';

import { getCanonicalUrl } from '@/i18n/canonical';

export default function PersonSeo() {
  const locale = useLocale();
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matthieu Compérat',
    url: getCanonicalUrl(locale, '/about'),
    jobTitle: 'Développeur Web & Mobile Freelance',
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
