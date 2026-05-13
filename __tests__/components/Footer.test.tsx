import { Footer } from '@/components/Footer';

import { render, screen } from '../test-utils';

describe('Footer Component', () => {
  it('should render the footer correctly', () => {
    const year = new Date().getFullYear();

    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();

    // Brand column
    expect(screen.getByText(/^Go Cosmic/)).toBeInTheDocument();
    expect(
      screen.getByText('A development & design studio building cosmic apps from the French Alps.')
    ).toBeInTheDocument();

    // Studio navigation
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getAllByRole('link', { name: 'Offers' })[0]).toHaveAttribute('href', '/offers');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');

    // Offers column
    expect(screen.getByText('Solo Cosmic Developer')).toBeInTheDocument();
    expect(screen.getByText('Complete Cosmic Team')).toBeInTheDocument();
    expect(screen.getByText('Developer + Designer Duo')).toBeInTheDocument();

    // Copyright
    expect(screen.getByText(`© ${year} Go Cosmic. All systems nominal.`)).toBeInTheDocument();
    expect(screen.getByText('Legal notices and AI usage available on the About page.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /web & mobile developer annecy \/ geneva/i })).toHaveAttribute(
      'href',
      '/local'
    );
  });
});
