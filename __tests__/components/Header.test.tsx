import { Header } from '@/components/Header';

import { render } from '../test-utils';

describe('Header Component', () => {
  it('should render the header correctly', () => {
    const { getByRole } = render(<Header />);

    const header = getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('text-ghost', 'flex', 'items-center', 'justify-between', 'bg-slate-950', 'p-4');

    const heading = getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Go Cosmic');
    expect(heading).toHaveAccessibleName('Go to homepage');

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
});
