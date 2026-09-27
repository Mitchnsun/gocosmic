import { fireEvent, within } from '@testing-library/react';
import type { MouseEvent, ReactNode } from 'react';

import FooterLanguages from '@/components/Footer/FooterLanguages';

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

  it('leaves a click that opens a new tab to the browser', () => {
    window.history.replaceState(null, '', '/projects?type=mobile');

    fireEvent.click(french(), { ctrlKey: true });

    expect(mockPush).not.toHaveBeenCalled();
  });
});
