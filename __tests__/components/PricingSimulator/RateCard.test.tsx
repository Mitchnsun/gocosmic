import { render, screen } from '@testing-library/react';

import { RateCard } from '@/components/PricingSimulator/RateCard';

const defaultProps = {
  title: 'Mobile Application',
  rate: '600€ excl. tax / day',
  rateNote: '*',
  description: 'Billed at a daily rate.',
  disclaimer: '* Indicative price.',
  accentColor: 'amber' as const,
};

describe('RateCard', () => {
  it('renders the title', () => {
    render(<RateCard {...defaultProps} />);
    expect(screen.getByText('Mobile Application')).toBeInTheDocument();
  });

  it('renders the rate', () => {
    render(<RateCard {...defaultProps} />);
    expect(screen.getByText('600€ excl. tax / day')).toBeInTheDocument();
  });

  it('renders the rate note', () => {
    render(<RateCard {...defaultProps} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<RateCard {...defaultProps} />);
    expect(screen.getByText('Billed at a daily rate.')).toBeInTheDocument();
  });

  it('renders the disclaimer', () => {
    render(<RateCard {...defaultProps} />);
    expect(screen.getByText('* Indicative price.')).toBeInTheDocument();
  });

  it('does not render noFixedPrice when not provided', () => {
    render(<RateCard {...defaultProps} />);
    expect(screen.queryByText(/no fixed price/i)).not.toBeInTheDocument();
  });

  it('renders noFixedPrice when provided', () => {
    render(<RateCard {...defaultProps} noFixedPrice="No fixed price for a fully customisable website." />);
    expect(screen.getByText('No fixed price for a fully customisable website.')).toBeInTheDocument();
  });

  it('applies the accent color class to the title', () => {
    render(<RateCard {...defaultProps} accentColor="purple" />);
    const title = screen.getByText('Mobile Application');
    expect(title).toHaveClass('text-purple-400');
  });
});
