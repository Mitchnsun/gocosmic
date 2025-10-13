import { vi } from 'vitest';

import { Header } from '@/components/Header';

import { render, screen } from '../test-utils';

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  redirect: vi.fn(),
  getPathname: vi.fn(() => '/en'),
}));

describe('Header Component', () => {
  it('should render the header correctly', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('text-ghost', 'flex', 'items-center', 'justify-between', 'bg-gray-900', 'p-4');

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Go Cosmic');
    expect(heading).toHaveAccessibleName('Go to homepage');

    // Check that translated navigation items are present as links
    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');

    const contactLink = screen.getByRole('link', { name: /contact/i });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', 'https://mcomper.at/');

    const servicesLink = screen.getByRole('link', { name: /services/i });
    expect(servicesLink).toBeInTheDocument();
  });
});
