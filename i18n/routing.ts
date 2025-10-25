import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'fr', 'es', 'de', 'it'],

  // Used when no locale matches
  defaultLocale: 'en',

  pathnames: {
    // Home page
    '/': '/',

    // About page
    '/about': {
      en: '/about',
      fr: '/a-propos',
      es: '/acerca-de',
      de: '/ueber-uns',
      it: '/chi-siamo',
    },

    // Services page
    '/services': {
      en: '/services',
      fr: '/services',
      es: '/servicios',
      de: '/dienstleistungen',
      it: '/servizi',
    },

    // Journey page
    '/journey': {
      en: '/journey',
      fr: '/voyage',
      es: '/viaje',
      de: '/reise',
      it: '/viaggio',
    },

    // Offers page
    '/offers': {
      en: '/offers',
      fr: '/nos-offres',
      es: '/nuestras-ofertas',
      de: '/unsere-angebote',
      it: '/le-nostre-offerte',
    },
  },
});
