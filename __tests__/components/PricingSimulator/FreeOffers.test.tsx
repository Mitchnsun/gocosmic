import { FreeOffers } from '@/components/PricingSimulator/FreeOffers';

import { render, screen } from '../../test-utils';

describe('FreeOffers', () => {
  it('announces both no-commitment offers', () => {
    render(<FreeOffers />);

    expect(screen.getByText(/free, no commitment/i)).toBeInTheDocument();
    expect(screen.getByText(/a mockup of your future website/i)).toBeInTheDocument();
    expect(screen.getByText(/a review of your current website/i)).toBeInTheDocument();
    expect(screen.getByText(/with no obligation/i)).toBeInTheDocument();
  });

  it('is a labelled section holding a list of offers', () => {
    render(<FreeOffers />);

    const section = screen.getByRole('region', { name: /before we talk budget/i });
    expect(section).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('offers a button to request each one', () => {
    render(<FreeOffers />);

    expect(screen.getByRole('link', { name: 'Request my free mockup' })).toHaveAttribute('href', '/free-mockup');
    expect(screen.getByRole('link', { name: 'Request my free review' })).toHaveAttribute('href', '/contact');
  });
});
