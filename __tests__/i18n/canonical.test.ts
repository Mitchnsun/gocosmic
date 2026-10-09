import { describe, expect, it } from 'vitest';

import { getAlternates, getCanonicalUrl, getLanguageAlternates } from '@/i18n/canonical';
import { SITE_URL } from '@/lib/config';

describe('getCanonicalUrl', () => {
  describe('home page (static pathname "/")', () => {
    it('returns the URL without trailing slash for English', () => {
      expect(getCanonicalUrl('en', '/')).toBe(`${SITE_URL}/en`);
    });

    it('returns the URL without trailing slash for French', () => {
      expect(getCanonicalUrl('fr', '/')).toBe(`${SITE_URL}/fr`);
    });

    it('returns the URL without trailing slash for German', () => {
      expect(getCanonicalUrl('de', '/')).toBe(`${SITE_URL}/de`);
    });
  });

  describe('about page (localized pathnames)', () => {
    it('resolves English pathname', () => {
      expect(getCanonicalUrl('en', '/about')).toBe(`${SITE_URL}/en/about`);
    });

    it('resolves French localized pathname /a-propos', () => {
      expect(getCanonicalUrl('fr', '/about')).toBe(`${SITE_URL}/fr/a-propos`);
    });

    it('resolves Spanish localized pathname /acerca-de', () => {
      expect(getCanonicalUrl('es', '/about')).toBe(`${SITE_URL}/es/acerca-de`);
    });

    it('resolves German localized pathname /ueber-uns', () => {
      expect(getCanonicalUrl('de', '/about')).toBe(`${SITE_URL}/de/ueber-uns`);
    });

    it('resolves Italian localized pathname /chi-siamo', () => {
      expect(getCanonicalUrl('it', '/about')).toBe(`${SITE_URL}/it/chi-siamo`);
    });
  });

  describe('services & pricing page (localized pathnames)', () => {
    it('resolves the Spanish and German localized pathnames', () => {
      expect(getCanonicalUrl('es', '/services')).toBe(`${SITE_URL}/es/servicios`);
      expect(getCanonicalUrl('de', '/services')).toBe(`${SITE_URL}/de/dienstleistungen`);
    });
  });

  describe('legal pages (localized pathnames)', () => {
    it('resolves French privacy pathname', () => {
      expect(getCanonicalUrl('fr', '/privacy')).toBe(`${SITE_URL}/fr/confidentialite`);
    });

    it('resolves German legal notice pathname', () => {
      expect(getCanonicalUrl('de', '/legal-notice')).toBe(`${SITE_URL}/de/impressum`);
    });
  });

  describe('projects index (localized pathnames)', () => {
    it('resolves French localized pathname /projets', () => {
      expect(getCanonicalUrl('fr', '/projects')).toBe(`${SITE_URL}/fr/projets`);
    });

    it('resolves Spanish localized pathname /proyectos', () => {
      expect(getCanonicalUrl('es', '/projects')).toBe(`${SITE_URL}/es/proyectos`);
    });
  });

  describe('local seo page (localized pathnames)', () => {
    it('resolves French localized pathname', () => {
      expect(getCanonicalUrl('fr', '/local')).toBe(`${SITE_URL}/fr/creation-site-internet-geneve-annecy`);
    });

    it('resolves German localized pathname', () => {
      expect(getCanonicalUrl('de', '/local')).toBe(`${SITE_URL}/de/website-erstellen-lassen-genf-annecy`);
    });
  });

  describe('Swiss locales', () => {
    it('prefixes the URL with the locale in lowercase', () => {
      expect(getCanonicalUrl('fr-CH', '/')).toBe(`${SITE_URL}/fr-ch`);
      expect(getCanonicalUrl('de-CH', '/services')).toBe(`${SITE_URL}/de-ch/dienstleistungen`);
    });

    it('shares the translated slug of their language', () => {
      expect(getCanonicalUrl('fr-CH', '/about')).toBe(`${SITE_URL}/fr-ch/a-propos`);
      expect(getCanonicalUrl('it-CH', '/local')).toBe(`${SITE_URL}/it-ch/creazione-siti-internet-ginevra-annecy`);
    });
  });

  describe('project sub-pages', () => {
    it('resolves French daily-fortune pathname', () => {
      expect(getCanonicalUrl('fr', '/projects/daily-fortune')).toBe(`${SITE_URL}/fr/projets/daily-fortune`);
    });

    it('resolves German mcomperat pathname', () => {
      expect(getCanonicalUrl('de', '/projects/mcomperat')).toBe(`${SITE_URL}/de/projekte/mcomperat`);
    });

    it('resolves Italian psc-supersprint pathname', () => {
      expect(getCanonicalUrl('it', '/projects/psc-supersprint')).toBe(`${SITE_URL}/it/progetti/psc-supersprint`);
    });

    it('resolves Spanish choeurdespaysdumontblanc pathname', () => {
      expect(getCanonicalUrl('es', '/projects/choeurdespaysdumontblanc')).toBe(
        `${SITE_URL}/es/proyectos/choeurdespaysdumontblanc`
      );
    });
  });
});

describe('getAlternates', () => {
  it('pairs the canonical URL with the page in every locale and an x-default', () => {
    expect(getAlternates('fr', '/about')).toEqual({
      canonical: `${SITE_URL}/fr/a-propos`,
      languages: {
        en: `${SITE_URL}/en/about`,
        fr: `${SITE_URL}/fr/a-propos`,
        es: `${SITE_URL}/es/acerca-de`,
        de: `${SITE_URL}/de/ueber-uns`,
        it: `${SITE_URL}/it/chi-siamo`,
        'en-CH': `${SITE_URL}/en-ch/about`,
        'fr-CH': `${SITE_URL}/fr-ch/a-propos`,
        'es-CH': `${SITE_URL}/es-ch/acerca-de`,
        'de-CH': `${SITE_URL}/de-ch/ueber-uns`,
        'it-CH': `${SITE_URL}/it-ch/chi-siamo`,
        'x-default': `${SITE_URL}/en/about`,
      },
    });
  });

  it('points a Swiss page to its own URL while listing the same translations', () => {
    const alternates = getAlternates('de-CH', '/about');

    expect(alternates.canonical).toBe(`${SITE_URL}/de-ch/ueber-uns`);
    expect(alternates.languages).toEqual(getLanguageAlternates('/about'));
  });

  it('gives the home page no trailing slash, since /en/ redirects to /en', () => {
    expect(getLanguageAlternates('/')).toMatchObject({ de: `${SITE_URL}/de`, 'x-default': `${SITE_URL}/en` });
  });
});
