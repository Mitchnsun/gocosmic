'use client';

import { JsonLdScript } from 'next-seo';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Matthieu Compérat',
  url: 'https://www.gocosmic.dev/fr/a-propos',
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

export default function PersonSeo() {
  return <JsonLdScript data={personJsonLd} scriptKey="person-jsonld" />;
}
