import { getRouteLocales, getSwitcherLanguages, hasRoute, redirectsToEnglish } from '@/i18n/route-locales';
import { type RouteKey, routing } from '@/i18n/routing';

// The story page stands in for a page published in French only.
vi.mock('@/i18n/routing', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n/routing')>()),
  ROUTE_LANGUAGES: { '/story': ['fr'] },
}));

describe('route languages', () => {
  it('finds every page in every locale unless it is restricted', () => {
    expect(getRouteLocales('/about')).toEqual([...routing.locales]);
    expect(hasRoute('de-CH', '/about')).toBe(true);
  });

  it('keeps a page published in French to French, Swiss version included', () => {
    expect(getRouteLocales('/story')).toEqual(['fr', 'fr-CH']);
    expect(hasRoute('fr-CH', '/story')).toBe(true);
    expect(hasRoute('en', '/story')).toBe(false);
    expect(hasRoute('it-CH', '/story')).toBe(false);
  });

  it('treats an unknown pathname as a page that exists everywhere', () => {
    expect(hasRoute('en', '/unknown')).toBe(true);
  });

  it("keeps Moi Président's legal pages to French and English, whose other languages fall back to English", () => {
    for (const route of [
      '/apps/moi-president/privacy',
      '/apps/moi-president/legal-notice',
      '/apps/moi-president/kit-licences',
    ]) {
      expect(getRouteLocales(route as RouteKey)).toEqual(['en', 'fr', 'en-CH', 'fr-CH']);
      expect(hasRoute('it-CH', route)).toBe(false);
      expect(redirectsToEnglish(route)).toBe(true);
    }
    // The presentation page is published in every language.
    expect(getRouteLocales('/apps/moi-president')).toEqual([...routing.locales]);
    expect(redirectsToEnglish('/apps/moi-president')).toBe(false);
  });

  it('offers in the switchers the languages of a page that falls back to English, and every language elsewhere', () => {
    expect(getSwitcherLanguages('/apps/moi-president/legal-notice')).toEqual(['en', 'fr']);
    expect(getSwitcherLanguages('/apps/moi-president')).toEqual(['en', 'fr', 'es', 'de', 'it']);
    // A page published in French only keeps every language: the others lead to their home page.
    expect(getSwitcherLanguages('/story')).toEqual(['en', 'fr', 'es', 'de', 'it']);
  });
});
