import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { act } from '@testing-library/react';

import { Header } from '@/components/Header';

import { render } from '../test-utils';

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
    expect(header).toHaveStyle({ height: '85px' });

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
    expect(header).toHaveStyle({ height: '85px' });

    mockScrollY = 120;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(header).toHaveStyle({ height: '64px' });
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

    expect(header).toHaveStyle({ height: '85px' });
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
    expect(header).toHaveStyle({ height: '85px' });

    mockScrollY = 100;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(header).toHaveStyle({ height: '56px' });

    Object.defineProperty(window, 'innerWidth', { writable: true, value: 500 });
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
    expect(header).toHaveStyle({ height: '64px' });
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
});
