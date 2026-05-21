import { Footer } from '@/components/Footer';

import { render } from '../test-utils';

describe('Footer Component', () => {
  it('should render the footer correctly', () => {
    const year = new Date().getFullYear();

    const { getByRole, getByText, getAllByRole } = render(<Footer />);

    expect(getByRole('contentinfo')).toBeInTheDocument();

    // Brand column
    expect(getByText(/^Go Cosmic/)).toBeInTheDocument();
    expect(getByText('A development & design studio building cosmic apps from the French Alps.')).toBeInTheDocument();

    // Studio navigation
    expect(getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(getAllByRole('link', { name: 'Offers' })[0]).toHaveAttribute('href', '/offers');
    expect(getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');

    // Offers column
    expect(getByText('Solo Cosmic Developer')).toBeInTheDocument();
    expect(getByText('Complete Cosmic Team')).toBeInTheDocument();
    expect(getByText('Developer + Designer Duo')).toBeInTheDocument();

    // Copyright
    expect(getByText(`© ${year} Go Cosmic. All systems nominal.`)).toBeInTheDocument();
    expect(getByText('Legal notices and AI usage available on the About page.')).toBeInTheDocument();
    expect(getByRole('link', { name: /web & mobile developer annecy \/ geneva/i })).toHaveAttribute('href', '/local');
  });
});
