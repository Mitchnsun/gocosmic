import { QuotedServices } from '@/components/PricingSimulator/QuotedServices';

import { render, screen } from '../../test-utils';

describe('QuotedServices', () => {
  it('lists the three services quoted outside the subscription', () => {
    render(<QuotedServices />);

    const section = screen.getByRole('region', { name: 'For your communication' });
    expect(section).toBeInTheDocument();
    expect(screen.getByText(/outside the subscription/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByText('A logo')).toBeInTheDocument();
    expect(screen.getByText('Posters and flyers')).toBeInTheDocument();
    expect(screen.getByText('Photos and videos')).toBeInTheDocument();
  });

  it('says they are made with partners and leads to a quote request', () => {
    render(<QuotedServices />);

    expect(screen.getByText(/local partners/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a quote' })).toHaveAttribute('href', '/contact');
  });
});
