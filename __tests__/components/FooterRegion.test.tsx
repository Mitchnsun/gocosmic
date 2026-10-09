import { fireEvent, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { MouseEvent, ReactNode } from 'react';

import FooterRegion from '@/components/Footer/FooterRegion';

import navigation from '../../messages/en/navigation.json';
import { render } from '../test-utils';

const mockPush = vi.fn();
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/projects',
  Link: ({
    children,
    href,
    onClick,
    locale,
    ...props
  }: {
    children: ReactNode;
    href: string;
    locale?: string;
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    [key: string]: unknown;
  }) => (
    <a href={`/${locale}${href}`} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}));

const inLocale = (locale: string) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale={locale} messages={navigation}>
        {children}
      </NextIntlClientProvider>
    );
  };

const region = (locale = 'en') =>
  within(render(<FooterRegion />, { wrapper: inLocale(locale) }).getByRole('navigation', { name: 'Switch region' }));

// jsdom cannot follow links: stop the clicks the component leaves to the browser once they bubbled up.
const blockNavigation = (event: Event) => event.preventDefault();

describe('FooterRegion', () => {
  beforeEach(() => {
    mockPush.mockClear();
    window.addEventListener('click', blockNavigation);
  });

  afterEach(() => {
    window.removeEventListener('click', blockNavigation);
    window.history.replaceState(null, '', '/');
  });

  it('marks Europe as current and links to the Swiss version from a language-only page', () => {
    const nav = region('en');

    expect(nav.getByText('Europe · EUR').parentElement).toHaveAttribute('aria-current', 'true');
    const swiss = nav.getByRole('link', { name: 'Switzerland · CHF' });
    expect(swiss).toHaveAttribute('href', '/en-CH/projects');
    expect(swiss).toHaveAttribute('hreflang', 'en-CH');
  });

  it('marks Switzerland as current and links back to the same language from a Swiss page', () => {
    const nav = region('fr-CH');

    expect(nav.getByText('Switzerland · CHF').parentElement).toHaveAttribute('aria-current', 'true');
    expect(nav.getByRole('link', { name: 'Europe · EUR' })).toHaveAttribute('href', '/fr/projects');
  });

  it('keeps the projects filter when switching region', () => {
    window.history.replaceState(null, '', '/projects?type=mobile');

    const notPrevented = fireEvent.click(region('fr-CH').getByRole('link', { name: 'Europe · EUR' }));

    expect(notPrevented).toBe(false);
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/projects', query: { type: 'mobile' } }, { locale: 'fr' });
  });
});
