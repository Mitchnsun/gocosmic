import { describe, expect, it } from 'vitest';

import { getCanonicalUrl, SITE_URL } from '@/i18n/canonical';

describe('getCanonicalUrl', () => {
  describe('home page (static pathname "/")', () => {
    it('returns trailing-slash URL for English', () => {
      expect(getCanonicalUrl('en', '/')).toBe(`${SITE_URL}/en/`);
    });

    it('returns trailing-slash URL for French', () => {
      expect(getCanonicalUrl('fr', '/')).toBe(`${SITE_URL}/fr/`);
    });

    it('returns trailing-slash URL for German', () => {
      expect(getCanonicalUrl('de', '/')).toBe(`${SITE_URL}/de/`);
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

  describe('journey page (localized pathnames)', () => {
    it('resolves French localized pathname /voyage', () => {
      expect(getCanonicalUrl('fr', '/journey')).toBe(`${SITE_URL}/fr/voyage`);
    });

    it('resolves German localized pathname /reise', () => {
      expect(getCanonicalUrl('de', '/journey')).toBe(`${SITE_URL}/de/reise`);
    });
  });

  describe('offers page (localized pathnames)', () => {
    it('resolves French localized pathname /nos-offres', () => {
      expect(getCanonicalUrl('fr', '/offers')).toBe(`${SITE_URL}/fr/nos-offres`);
    });

    it('resolves German localized pathname /unsere-angebote', () => {
      expect(getCanonicalUrl('de', '/offers')).toBe(`${SITE_URL}/de/unsere-angebote`);
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
