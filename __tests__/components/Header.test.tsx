import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { act, fireEvent } from '@testing-library/react';

import { Header } from '@/components/Header';

import { render } from '../test-utils';

const expectHeaderHeight = (element: HTMLElement, height: number) => {
  expect(element).toHaveStyle({ height: `calc(${height}px + env(safe-area-inset-top, 0px))` });
};

let mockPathname = '/en';
vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => mockPathname,
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string | { pathname: string; hash?: string };
    [key: string]: unknown;
  }) => {
    const resolvedHref = typeof href === 'string' ? href : `${href.pathname}${href.hash ? `#${href.hash}` : ''}`;
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
  redirect: vi.fn(),
  getPathname: vi.fn(() => '/en'),
}));

describe('Header Component', () => {
  beforeEach(() => {
    mockPathname = '/en';
  });

  it('should render the header correctly', () => {
    const { getByRole } = render(<Header />);

    const header = getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('text-ghost', 'sticky', 'top-0', 'backdrop-blur-md');
    expectHeaderHeight(header, 85);

    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Go Cosmic');
    expect(heading).toHaveAccessibleName('Go to homepage');
    expect(getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');

    // Check that translated navigation items are present as links
    const aboutLink = getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');

    const contactLink = getByRole('link', { name: /contact/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/contact');

    const servicesLink = getByRole('link', { name: /services/i });
    expect(servicesLink).toBeInTheDocument();
  });

  it('renders the MobileMenuButton', () => {
    const { getByRole } = render(<Header />);
    const burgerButton = getByRole('button', { name: /open menu/i });
    expect(burgerButton).toBeInTheDocument();
    expect(burgerButton).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('desktop nav has hidden class', () => {
    const { getByRole } = render(<Header />);
    const nav = getByRole('navigation', { name: /main navigation/i });
    expect(nav).toHaveClass('hidden');
  });

  it('compacts the header while scrolling down', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 });
    let mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    const { getByRole } = render(<Header />);
    const header = getByRole('banner');
    expectHeaderHeight(header, 85);

    mockScrollY = 120;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expectHeaderHeight(header, 64);
  });

  it('keeps max height when adaptiveHeight is disabled', () => {
    let mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    const { getByRole } = render(<Header adaptiveHeight={false} />);
    const header = getByRole('banner');

    mockScrollY = 300;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expectHeaderHeight(header, 85);
  });

  it('uses tablet and mobile adaptive heights', () => {
    let mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
    const { getByRole } = render(<Header />);
    const header = getByRole('banner');
    expectHeaderHeight(header, 85);

    mockScrollY = 100;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expectHeaderHeight(header, 56);

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expectHeaderHeight(header, 64);
  });

  it('supports disabling reduced-motion detection', () => {
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');

    const { getByRole } = render(<Header respectReducedMotion={false} />);
    expect(getByRole('banner')).toBeInTheDocument();
    expect(matchMediaSpy).not.toHaveBeenCalled();
  });

  it('renders the orbital dot by default', () => {
    const { getByRole } = render(<Header />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('hides the orbital dot when logoOrbitalEnabled is false', () => {
    const { getByRole } = render(<Header logoOrbitalEnabled={false} />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('marks a nav item active when isActive is explicitly true', () => {
    const { getByRole } = render(
      <Header
        navItems={[
          {
            label: 'Services',
            href: '/services',
            ariaLabel: 'Services',
            icon: WrenchScrewdriverIcon,
            isActive: true,
          },
        ]}
      />
    );
    const link = getByRole('link', { name: 'Services' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('opacity-100');
  });

  it('marks a nav item active when pathname equals the href', () => {
    mockPathname = '/services';
    const { getByRole } = render(<Header />);
    expect(getByRole('link', { name: /our cosmic services/i })).toHaveAttribute('aria-current', 'page');
  });

  it('marks a nav item active when pathname starts with the href', () => {
    mockPathname = '/services/sub-page';
    const { getByRole } = render(<Header />);
    expect(getByRole('link', { name: /our cosmic services/i })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the mobile menu when the burger button is clicked', () => {
    const { getByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getByRole('button', { name: /open menu/i }));
    });

    expect(getByRole('dialog', { name: /^menu$/i })).toBeInTheDocument();
  });

  it('opens the lang drawer when the mobile language switcher is clicked', () => {
    const { getAllByRole, getByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getAllByRole('button', { name: /switch language/i })[1]!);
    });

    expect(getByRole('dialog', { name: /switch language/i })).toBeInTheDocument();
  });

  it('closes the lang drawer after selecting a language', () => {
    const { getAllByRole, getByRole, queryByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getAllByRole('button', { name: /switch language/i })[1]!);
    });
    expect(getByRole('dialog', { name: /switch language/i })).toBeInTheDocument();

    act(() => {
      fireEvent.click(getByRole('button', { name: 'Français' }));
    });

    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes the mobile menu when Escape is pressed', () => {
    const { getByRole, queryByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getByRole('button', { name: /open menu/i }));
    });
    expect(getByRole('dialog', { name: /^menu$/i })).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });

    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('expands the header when scrolling back up after compact', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 });
    let mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    const { getByRole } = render(<Header />);
    const header = getByRole('banner');

    mockScrollY = 120;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expectHeaderHeight(header, 64);

    mockScrollY = 20;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expectHeaderHeight(header, 85);
  });

  it('reapplies expanded height on resize when not compact', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 });
    const mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    const { getByRole } = render(<Header />);
    const header = getByRole('banner');
    expectHeaderHeight(header, 85);

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 800 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expectHeaderHeight(header, 85);
  });
});
