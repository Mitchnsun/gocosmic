import { Footer } from '@/components/Footer';

import { render, screen } from '../test-utils';

describe('Footer Component', () => {
  it('should render the footer correctly', () => {
    const year = new Date().getFullYear();

    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText('Go Cosmic')).toBeInTheDocument();
    expect(screen.getByText('Based in Annecy, serving Geneva and Haute-Savoie.')).toBeInTheDocument();
    expect(screen.getByText('Phone: +33 6 00 00 00 00')).toBeInTheDocument();
    expect(screen.getByText('Legal notices and AI usage available on the About page.')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(screen.getByRole('link', { name: 'Offers' })).toHaveAttribute('href', '/offers');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');
    expect(screen.getByText(`© ${year} Go Cosmic. All rights reserved.`)).toBeInTheDocument();
  });
});
