import { RateCard } from '@/components/PricingSimulator/RateCard';

import { render } from '../../test-utils';

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
    const { getByText } = render(<RateCard {...defaultProps} />);
    expect(getByText('Mobile Application')).toBeInTheDocument();
  });

  it('renders the rate', () => {
    const { getByText } = render(<RateCard {...defaultProps} />);
    expect(getByText('600€ excl. tax / day')).toBeInTheDocument();
  });

  it('renders the rate note', () => {
    const { getByText } = render(<RateCard {...defaultProps} />);
    expect(getByText('*')).toBeInTheDocument();
  });

  it('renders the description', () => {
    const { getByText } = render(<RateCard {...defaultProps} />);
    expect(getByText('Billed at a daily rate.')).toBeInTheDocument();
  });

  it('renders the disclaimer', () => {
    const { getByText } = render(<RateCard {...defaultProps} />);
    expect(getByText('* Indicative price.')).toBeInTheDocument();
  });

  it('does not render noFixedPrice when not provided', () => {
    const { queryByText } = render(<RateCard {...defaultProps} />);
    expect(queryByText(/no fixed price/i)).not.toBeInTheDocument();
  });

  it('renders noFixedPrice when provided', () => {
    const { getByText } = render(
      <RateCard {...defaultProps} noFixedPrice="No fixed price for a fully customisable website." />
    );
    expect(getByText('No fixed price for a fully customisable website.')).toBeInTheDocument();
  });

  it('applies the accent color class to the title', () => {
    const { getByText } = render(<RateCard {...defaultProps} accentColor="purple" />);
    const title = getByText('Mobile Application');
    expect(title).toHaveClass('text-purple-400');
  });
});
