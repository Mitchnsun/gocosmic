import { getRouteLocales, hasRoute } from '@/i18n/route-locales';
import { routing } from '@/i18n/routing';

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
});
