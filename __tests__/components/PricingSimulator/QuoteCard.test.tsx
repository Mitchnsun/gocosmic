import { QuoteCard } from '@/components/PricingSimulator/QuoteCard';

import { render, screen } from '../../test-utils';

describe('QuoteCard', () => {
  it('renders the note, title and description', () => {
    render(<QuoteCard note="Custom project" title="Let's talk" description="Priced case by case." />);

    expect(screen.getByText('Custom project')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: "Let's talk" })).toBeInTheDocument();
    expect(screen.getByText('Priced case by case.')).toBeInTheDocument();
  });
});
