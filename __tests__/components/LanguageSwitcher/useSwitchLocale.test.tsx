import { act, renderHook } from '@testing-library/react';

import { useSwitchLocale } from '@/components/LanguageSwitcher/useSwitchLocale';

const mockPush = vi.fn();
let mockPathname = '/services';
let mockLocale = 'en';
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
}));
vi.mock('next-intl', () => ({ useLocale: () => mockLocale }));

describe('useSwitchLocale', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockPathname = '/services';
    mockLocale = 'en';
    window.history.replaceState(null, '', '/');
  });

  it('switches to the bare page when the URL has neither query nor anchor', () => {
    const { result } = renderHook(() => useSwitchLocale());

    act(() => result.current('fr'));

    expect(mockPush).toHaveBeenCalledWith('/services', { locale: 'fr' });
  });

  it('keeps the query, such as the projects filter', () => {
    mockPathname = '/projects';
    window.history.replaceState(null, '', '/en/projects?type=mobile');
    const { result } = renderHook(() => useSwitchLocale());

    act(() => result.current('de'));

    expect(mockPush).toHaveBeenCalledWith({ pathname: '/projects', query: { type: 'mobile' } }, { locale: 'de' });
  });

  it('brings the visitor back to the same section once the translated page is shown', () => {
    const section = document.createElement('section');
    section.id = 'simulator';
    section.scrollIntoView = vi.fn();
    document.body.append(section);
    window.history.replaceState(null, '', '/en/services#simulator');
    const { result, rerender } = renderHook(() => useSwitchLocale());

    act(() => result.current('fr'));
    expect(mockPush).toHaveBeenCalledWith('/services', { locale: 'fr', scroll: false });

    // Another switcher rendering before the navigation ends must not apply the anchor to the current page.
    rerender();
    expect(window.location.hash).toBe('#simulator');
    expect(section.scrollIntoView).not.toHaveBeenCalled();

    // The router lands on the translated page, without the anchor.
    window.history.replaceState(null, '', '/fr/services');
    mockLocale = 'fr';
    rerender();

    expect(window.location.hash).toBe('#simulator');
    expect(window.location.pathname).toBe('/fr/services');
    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
    section.remove();
  });

  it('restores the anchor only once', () => {
    window.history.replaceState(null, '', '/en/services#pricing');
    const { result, rerender } = renderHook(() => useSwitchLocale());
    act(() => result.current('it'));

    window.history.replaceState(null, '', '/it/servizi');
    mockLocale = 'it';
    rerender();
    window.history.replaceState(null, '', '/it/servizi');
    mockPathname = '/about';
    rerender();

    expect(window.location.hash).toBe('');
  });

  it('forgets an anchor when the next switch is made from a page without one', () => {
    window.history.replaceState(null, '', '/en/services#pricing');
    const { result, rerender } = renderHook(() => useSwitchLocale());
    act(() => result.current('es'));
    window.history.replaceState(null, '', '/en/services');
    act(() => result.current('es'));

    window.history.replaceState(null, '', '/es/servicios');
    mockLocale = 'es';
    rerender();

    expect(window.location.hash).toBe('');
  });

  it('stays on the page when the language picked is the one already shown', () => {
    window.history.replaceState(null, '', '/en/services#simulator');
    const { result, rerender } = renderHook(() => useSwitchLocale());

    act(() => result.current('en'));
    expect(mockPush).not.toHaveBeenCalled();

    // A later same-language navigation must not inherit the anchor.
    window.history.replaceState(null, '', '/en/about');
    mockPathname = '/about';
    rerender();
    expect(window.location.hash).toBe('');
  });

  it('scrolls to the section of a percent-encoded anchor', () => {
    const section = document.createElement('section');
    section.id = 'étape';
    section.scrollIntoView = vi.fn();
    document.body.append(section);
    window.history.replaceState(null, '', '/en/services#%C3%A9tape');
    const { result, rerender } = renderHook(() => useSwitchLocale());
    act(() => result.current('fr'));

    window.history.replaceState(null, '', '/fr/services');
    mockLocale = 'fr';
    rerender();

    expect(window.location.hash).toBe('#%C3%A9tape');
    expect(section.scrollIntoView).toHaveBeenCalledTimes(1);
    section.remove();
  });

  it('restores a malformed anchor as is instead of throwing', () => {
    window.history.replaceState(null, '', '/en/services#%');
    const { result, rerender } = renderHook(() => useSwitchLocale());
    act(() => result.current('fr'));

    window.history.replaceState(null, '', '/fr/services');
    mockLocale = 'fr';
    expect(() => rerender()).not.toThrow();
    expect(window.location.hash).toBe('#%');
  });

  it('does not bring an anchor over to a different page than the one it was set on', () => {
    window.history.replaceState(null, '', '/en/services#faq');
    const { result, rerender } = renderHook(() => useSwitchLocale());
    act(() => result.current('de'));

    window.history.replaceState(null, '', '/de/projekte');
    mockLocale = 'de';
    mockPathname = '/projects';
    rerender();

    expect(window.location.hash).toBe('');
  });
});
