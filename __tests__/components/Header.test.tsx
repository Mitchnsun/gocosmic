import { act } from '@testing-library/react';

import { Header } from '@/components/Header';

import { render } from '../test-utils';

describe('Header Component', () => {
  it('should render the header correctly', () => {
    const { getByRole } = render(<Header />);

    const header = getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('text-ghost', 'sticky', 'top-0', 'backdrop-blur-md');
    expect(header).toHaveStyle({ height: '96px' });

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

  it('compacts the header while scrolling down', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: 1280 });
    let mockScrollY = 0;
    Object.defineProperty(window, 'scrollY', {
      configurable: true,
      get: () => mockScrollY,
    });

    const { getByRole } = render(<Header />);
    const header = getByRole('banner');
    expect(header).toHaveStyle({ height: '96px' });

    mockScrollY = 120;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(header).toHaveStyle({ height: '64px' });
  });
});
