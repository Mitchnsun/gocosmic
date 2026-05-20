import { PricingTeaser } from '@/components/PricingTeaser';

import { render, screen } from '../test-utils';

describe('PricingTeaser', () => {
  it('should render the price, tagline and scope note', () => {
    render(<PricingTeaser />);

    expect(screen.getByText(/from 50€/i)).toBeInTheDocument();
    expect(screen.getByText(/all-inclusive, no surprises/i)).toBeInTheDocument();
    expect(screen.getByText(/without order management or client portal/i)).toBeInTheDocument();
  });

  it('should render all feature items', () => {
    render(<PricingTeaser />);

    expect(screen.getByText(/graphic redesign of your showcase website/i)).toBeInTheDocument();
    expect(screen.getByText(/seo optimisation/i)).toBeInTheDocument();
    expect(screen.getByText(/regular technical updates/i)).toBeInTheDocument();
    expect(screen.getByText(/web hosting/i)).toBeInTheDocument();
    expect(screen.getByText(/ssl certificate/i)).toBeInTheDocument();
    expect(screen.getAllByText(/domain name/i).length).toBeGreaterThan(0);
  });

  it('should render the domain/email footnote and scope footnote', () => {
    render(<PricingTeaser />);

    expect(screen.getByText(/depending on the chosen domain name/i)).toBeInTheDocument();
    expect(screen.getByText(/e-commerce shop or client portal/i)).toBeInTheDocument();
  });

  it('should render the mockup mention', () => {
    render(<PricingTeaser />);

    expect(screen.getByText(/request your mockup with no commitment/i)).toBeInTheDocument();
  });

  it('should render the simulate pricing link pointing to /pricing', () => {
    render(<PricingTeaser />);

    const link = screen.getByRole('link', { name: /simulate my pricing/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('/pricing'));
  });

  it('should render the contact link pointing to /contact', () => {
    render(<PricingTeaser />);

    const link = screen.getByRole('link', { name: /request a quote/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('/contact'));
  });
});
