import { PriceTotal } from '@/components/PricingSimulator/PriceTotal';

import { render, screen } from '../../test-utils';

describe('PriceTotal', () => {
  it('renders the label, amount, period and note', () => {
    render(<PriceTotal label="Your plan" amount="25€" period="/ month" note="Change it any time." />);

    expect(screen.getByText('Your plan')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: /your plan/i })).toHaveTextContent('25€');
    expect(screen.getByText('/ month')).toBeInTheDocument();
    expect(screen.getByText('Change it any time.')).toBeInTheDocument();
  });

  it('announces the amount as it changes', () => {
    render(<PriceTotal label="Your plan" amount="25€" period="/ month" note="note" />);

    expect(screen.getByRole('status', { name: /your plan/i })).toHaveAttribute('aria-live', 'polite');
  });
});
