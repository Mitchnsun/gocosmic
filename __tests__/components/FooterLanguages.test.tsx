import { fireEvent, within } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import type { MouseEvent, ReactNode } from 'react';

import FooterLanguages from '@/components/Footer/FooterLanguages';

import navigation from '../../messages/en/navigation.json';
import { render } from '../test-utils';

const mockPush = vi.fn();
let mockPathname = '/projects';
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => mockPathname,
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

// The story page stands in for a page published in French only.
vi.mock('@/i18n/routing', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/i18n/routing')>()),
  ROUTE_LANGUAGES: { '/story': ['fr'] },
}));

const french = () => {
  const { getByRole } = render(<FooterLanguages />);
  return within(getByRole('navigation', { name: 'Switch language' })).getByRole('link', { name: 'Français (FR)' });
};

// jsdom cannot follow links: stop the clicks the component leaves to the browser once they bubbled up.
const blockNavigation = (event: Event) => event.preventDefault();

describe('FooterLanguages', () => {
  beforeEach(() => {
    mockPush.mockClear();
    window.addEventListener('click', blockNavigation);
  });

  afterEach(() => {
    window.removeEventListener('click', blockNavigation);
    window.history.replaceState(null, '', '/');
    mockPathname = '/projects';
  });

  it('keeps the projects filter when switching language', () => {
    window.history.replaceState(null, '', '/projects?type=mobile');
    const link = french();

    const notPrevented = fireEvent.click(link);

    expect(notPrevented).toBe(false);
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/projects', query: { type: 'mobile' } }, { locale: 'fr' });
  });

  it('keeps the section anchor when switching language', () => {
    window.history.replaceState(null, '', '/services#simulator');

    fireEvent.click(french());

    expect(mockPush).toHaveBeenCalledWith('/projects', { locale: 'fr', scroll: false });
  });

  it('lets the link navigate on its own when the page has no query nor anchor', () => {
    const link = french();

    expect(link).toHaveAttribute('href', '/fr/projects');
    fireEvent.click(link, { button: 0 });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('links a Swiss page to the Swiss version in every other language', () => {
    const swiss = ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale="fr-CH" messages={navigation}>
        {children}
      </NextIntlClientProvider>
    );
    const { getByRole } = render(<FooterLanguages />, { wrapper: swiss });
    const nav = within(getByRole('navigation', { name: 'Switch language' }));

    expect(nav.getByText('Français', { selector: '[lang="fr"]' }).parentElement).toHaveAttribute(
      'aria-current',
      'true'
    );
    const german = nav.getByRole('link', { name: 'Deutsch (DE)' });
    expect(german).toHaveAttribute('href', '/de-CH/projects');
    expect(german).toHaveAttribute('hreflang', 'de-CH');
    expect(german).toHaveAttribute('lang', 'de');
  });

  it('leaves a click that opens a new tab to the browser', () => {
    window.history.replaceState(null, '', '/projects?type=mobile');

    fireEvent.click(french(), { ctrlKey: true });

    expect(mockPush).not.toHaveBeenCalled();
  });

  it('links a page published in French only to the home page of the other languages', () => {
    mockPathname = '/story';
    const french = ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale="fr" messages={navigation}>
        {children}
      </NextIntlClientProvider>
    );
    const { getByRole } = render(<FooterLanguages />, { wrapper: french });
    const nav = within(getByRole('navigation', { name: 'Switch language' }));

    expect(nav.getByRole('link', { name: 'English (EN)' })).toHaveAttribute('href', '/en/');
    expect(nav.getByRole('link', { name: 'Italiano (IT)' })).toHaveAttribute('href', '/it/');
  });
});
