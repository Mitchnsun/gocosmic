import { ContactBanner } from '@/components/PricingSimulator/ContactBanner';

import { render, screen } from '../../test-utils';

describe('ContactBanner', () => {
  it('renders the contact title', () => {
    render(<ContactBanner />);
    expect(screen.getByText("Let's discuss your project")).toBeInTheDocument();
  });

  it('renders the contact description', () => {
    render(<ContactBanner />);
    expect(screen.getByText(/write me a few lines/i)).toBeInTheDocument();
  });

  it('renders the email address', () => {
    render(<ContactBanner />);
    expect(screen.getByText('prospect@gocosmic.dev')).toBeInTheDocument();
  });

  it('renders a mailto link with correct email and subject', () => {
    render(<ContactBanner />);
    const link = screen.getByRole('link', { name: /send an email/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('mailto:prospect@gocosmic.dev'));
    expect(link).toHaveAttribute('href', expect.stringContaining('subject='));
  });

  it('renders the CTA button text', () => {
    render(<ContactBanner />);
    expect(screen.getByText('Request a quote')).toBeInTheDocument();
  });

  it('renders a link to the free mockup page', () => {
    render(<ContactBanner />);

    const link = screen.getByRole('link', { name: 'Go to the free mockup request page' });
    expect(link).toHaveAttribute('href', '/free-mockup');
    expect(link).toHaveTextContent('Get a free mockup');
  });

  it('renders the privacy notice link', () => {
    render(<ContactBanner />);

    expect(screen.getByText(/processed to prepare a quote/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
  });
});
