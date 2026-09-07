import { PricingTeaser } from '@/components/PricingTeaser';

import { render, screen } from '../test-utils';

describe('PricingTeaser', () => {
  it('should render the euro price, tagline and scope note', () => {
    render(<PricingTeaser currency="eur" />);

    expect(screen.getByText(/from 10€/i)).toBeInTheDocument();
    expect(screen.getByText(/all-inclusive, no surprises/i)).toBeInTheDocument();
    expect(screen.getByText(/without order management or client portal/i)).toBeInTheDocument();
  });

  it('should render all feature items', () => {
    render(<PricingTeaser currency="eur" />);

    expect(screen.getByText(/graphic redesign of your showcase website/i)).toBeInTheDocument();
    expect(screen.getByText(/seo optimisation/i)).toBeInTheDocument();
    expect(screen.getByText(/regular technical updates/i)).toBeInTheDocument();
    expect(screen.getByText(/web hosting/i)).toBeInTheDocument();
    expect(screen.getByText(/secure connection/i)).toBeInTheDocument();
  });

  it('should present the domain and email as paid options, not bundled features', () => {
    render(<PricingTeaser currency="eur" />);

    expect(screen.getByText(/domain name, email address and extra pages are optional/i)).toBeInTheDocument();
    expect(screen.getByText(/e-commerce shop or client portal/i)).toBeInTheDocument();
  });

  it('should render the mockup mention', () => {
    render(<PricingTeaser currency="eur" />);

    expect(screen.getByText(/request your mockup with no commitment/i)).toBeInTheDocument();
  });

  it('should render the simulate pricing link pointing to /pricing', () => {
    render(<PricingTeaser currency="eur" />);

    const link = screen.getByRole('link', { name: /simulate my pricing/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('/pricing'));
  });

  it('should render the contact link pointing to /contact', () => {
    render(<PricingTeaser currency="eur" />);

    const link = screen.getByRole('link', { name: /request a quote/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', expect.stringContaining('/contact'));
  });

  it('should render the franc price for Swiss visitors', () => {
    render(<PricingTeaser currency="chf" />);

    expect(screen.getByText(/from 10 CHF/i)).toBeInTheDocument();
    expect(screen.queryByText(/10€/)).not.toBeInTheDocument();
  });
});
