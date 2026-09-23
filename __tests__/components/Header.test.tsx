import { act, fireEvent, within } from '@testing-library/react';

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
    expectHeaderHeight(header, 64);

    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Cosmic Studio.');
    expect(getByRole('link', { name: 'Cosmic Studio, home' })).toHaveAttribute('href', '/');
    expect(getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main-content');
  });

  it('shows Services, Projects and Contact, and leaves About and Pricing to the footer', () => {
    const { getByRole, queryByRole } = render(<Header />);
    const nav = getByRole('navigation', { name: /main navigation/i });

    expect(getByRole('link', { name: 'Services & pricing' })).toHaveAttribute('href', '/services');
    expect(getByRole('link', { name: 'Our projects' })).toHaveAttribute('href', '/projects');
    expect(getByRole('link', { name: 'Contact Cosmic Studio' })).toHaveAttribute('href', '/contact');
    expect(nav).toHaveTextContent(/^ServicesProjectsContact/);
    expect(queryByRole('link', { name: /^about/i })).not.toBeInTheDocument();
    expect(queryByRole('link', { name: /^pricing/i })).not.toBeInTheDocument();
  });

  it('renders the primary CTA pill leading to the free mockup request', () => {
    const { getByRole } = render(<Header />);
    const cta = getByRole('link', { name: 'Get my free mockup' });

    expect(cta).toHaveAttribute('href', '/free-mockup');
    expect(cta).toHaveClass('bg-aerospace', 'text-void', 'rounded-full', 'h-11');
  });

  it('accepts a custom logo', () => {
    const { getByRole } = render(<Header logo="Test Studio" />);
    expect(getByRole('link', { name: 'Test Studio, home' })).toHaveTextContent('Test Studio.');
  });

  it('renders the MobileMenuButton', () => {
    const { getByRole } = render(<Header />);
    const burgerButton = getByRole('button', { name: /open menu/i });
    expect(burgerButton).toBeInTheDocument();
    expect(burgerButton).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(burgerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('switches to the burger below the lg breakpoint (tablets included)', () => {
    const { getByRole } = render(<Header />);
    const nav = getByRole('navigation', { name: /main navigation/i });
    expect(nav).toHaveClass('hidden', 'lg:flex');
    expect(getByRole('button', { name: /open menu/i }).parentElement).toHaveClass('lg:hidden');
  });

  it('keeps a fixed height while scrolling', () => {
    let mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    const { getByRole } = render(<Header />);
    const header = getByRole('banner');

    mockScrollY = 300;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expectHeaderHeight(header, 64);
  });

  it('marks a nav item active when isActive is explicitly true', () => {
    const { getByRole } = render(
      <Header navItems={[{ label: 'Services', href: '/services', ariaLabel: 'Services', isActive: true }]} />
    );
    const link = getByRole('link', { name: 'Services' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('text-ghost');
    expect(link).not.toHaveClass('text-ghost/75');
  });

  it('marks a nav item active when pathname equals the href', () => {
    mockPathname = '/services';
    const { getByRole } = render(<Header />);
    expect(getByRole('link', { name: 'Services & pricing' })).toHaveAttribute('aria-current', 'page');
    expect(getByRole('link', { name: 'Our projects' })).not.toHaveAttribute('aria-current');
  });

  it('marks a nav item active when pathname starts with the href', () => {
    mockPathname = '/projects/daily-fortune';
    const { getByRole } = render(<Header />);
    expect(getByRole('link', { name: 'Our projects' })).toHaveAttribute('aria-current', 'page');
  });

  it('opens the mobile menu with a Home link and the primary CTA', () => {
    const { getByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getByRole('button', { name: /open menu/i }));
    });

    const menu = getByRole('dialog', { name: /^menu$/i });
    expect(within(menu).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(menu).getByRole('link', { name: 'Services & pricing' })).toHaveAttribute('href', '/services');
    expect(within(menu).getByRole('link', { name: 'Contact Cosmic Studio' })).toHaveAttribute('href', '/contact');
    expect(within(menu).getByRole('link', { name: 'Get my free mockup' })).toHaveAttribute('href', '/free-mockup');
  });

  it('opens the lang drawer when the mobile language switcher is clicked', () => {
    const { getAllByRole, getByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getAllByRole('button', { name: /switch language/i })[1]!);
    });

    expect(getByRole('dialog', { name: /switch language/i })).toBeInTheDocument();
  });

  it('closes the mobile menu when the lang drawer opens', () => {
    const { getAllByRole, getByRole, queryByRole } = render(<Header />);

    act(() => {
      fireEvent.click(getByRole('button', { name: /open menu/i }));
    });
    expect(getByRole('dialog', { name: /^menu$/i })).toBeInTheDocument();

    act(() => {
      fireEvent.click(getAllByRole('button', { name: /switch language/i })[1]!);
    });

    expect(queryByRole('dialog', { name: /^menu$/i })).not.toBeInTheDocument();
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
});
