import { defineRouting } from 'next-intl/routing';

// Relative import: `next.config.ts` loads this module before path aliases exist.
import { DEFAULT_LANGUAGE, getLanguage, type Language, type Locale, LOCALE_PREFIXES, LOCALES } from './locales';

/** A page's slug in every locale, from its slug in each language: a Swiss locale shares its language's slug. */
function localized(slugs: Record<Language, string>): Record<Locale, string> {
  return Object.fromEntries(LOCALES.map((locale) => [locale, slugs[getLanguage(locale)]])) as Record<Locale, string>;
}

export const routing = defineRouting({
  // Every language, then its Swiss variant (see `i18n/locales.ts`)
  locales: LOCALES,

  // Used when no locale matches
  defaultLocale: DEFAULT_LANGUAGE,

  // Swiss locales show in URLs in lowercase: `/fr-ch/a-propos`
  localePrefix: { mode: 'always', prefixes: LOCALE_PREFIXES },

  // hreflang links come from each page's metadata and the sitemap; the middleware's `Link` header
  // pointed x-default to an unprefixed URL that redirects, so it is turned off.
  alternateLinks: false,

  pathnames: {
    // Home page
    '/': '/',

    // About page
    '/about': localized({
      en: '/about',
      fr: '/a-propos',
      es: '/acerca-de',
      de: '/ueber-uns',
      it: '/chi-siamo',
    }),

    // Services page
    '/services': localized({
      en: '/services',
      fr: '/services',
      es: '/servicios',
      de: '/dienstleistungen',
      it: '/servizi',
    }),

    // Projects - Daily Fortune
    '/projects/daily-fortune': localized({
      en: '/projects/daily-fortune',
      fr: '/projets/daily-fortune',
      es: '/proyectos/daily-fortune',
      de: '/projekte/daily-fortune',
      it: '/progetti/daily-fortune',
    }),

    // Projects - mcomperat
    '/projects/mcomperat': localized({
      en: '/projects/mcomperat',
      fr: '/projets/mcomperat',
      es: '/proyectos/mcomperat',
      de: '/projekte/mcomperat',
      it: '/progetti/mcomperat',
    }),

    // Projects - PSC Supersprint
    '/projects/psc-supersprint': localized({
      en: '/projects/psc-supersprint',
      fr: '/projets/psc-supersprint',
      es: '/proyectos/psc-supersprint',
      de: '/projekte/psc-supersprint',
      it: '/progetti/psc-supersprint',
    }),

    // Projects - Choeur des Pays du Mont Blanc
    '/projects/choeurdespaysdumontblanc': localized({
      en: '/projects/choeurdespaysdumontblanc',
      fr: '/projets/choeurdespaysdumontblanc',
      es: '/proyectos/choeurdespaysdumontblanc',
      de: '/projekte/choeurdespaysdumontblanc',
      it: '/progetti/choeurdespaysdumontblanc',
    }),

    // Contact page
    '/contact': localized({
      en: '/contact',
      fr: '/contact',
      es: '/contacto',
      de: '/kontakt',
      it: '/contatto',
    }),

    // Privacy policy
    '/privacy': localized({
      en: '/privacy',
      fr: '/confidentialite',
      es: '/privacidad',
      de: '/datenschutz',
      it: '/privacy',
    }),

    // Legal notice
    '/legal-notice': localized({
      en: '/legal-notice',
      fr: '/mentions-legales',
      es: '/aviso-legal',
      de: '/impressum',
      it: '/note-legali',
    }),

    // Terms of sale
    // Internal design system page: noindex, left out of the sitemap
    '/design-system': '/design-system',

    '/terms': localized({
      en: '/terms',
      fr: '/conditions-generales-de-vente',
      es: '/condiciones-generales',
      de: '/agb',
      it: '/condizioni-generali',
    }),

    // Local SEO page
    '/local': localized({
      en: '/web-mobile-developer-annecy-geneva',
      fr: '/developpeur-web-mobile-annecy-geneve',
      es: '/desarrollador-web-movil-annecy-ginebra',
      de: '/web-mobile-entwickler-annecy-genf',
      it: '/sviluppatore-web-mobile-annecy-ginevra',
    }),

    // Projects index page
    '/projects': localized({
      en: '/projects',
      fr: '/projets',
      es: '/proyectos',
      de: '/projekte',
      it: '/progetti',
    }),

    // Free mockup request page
    '/free-mockup': localized({
      en: '/free-mockup',
      fr: '/maquette-gratuite',
      es: '/maqueta-gratuita',
      de: '/kostenloses-mockup',
      it: '/mockup-gratuito',
    }),
  },
});
