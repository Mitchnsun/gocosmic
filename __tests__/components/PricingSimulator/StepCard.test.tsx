import { render, screen } from '@testing-library/react';

import { StepCard } from '@/components/PricingSimulator/StepCard';

describe('StepCard', () => {
  it('renders its children', () => {
    render(
      <StepCard>
        <p>Step content</p>
      </StepCard>
    );

    expect(screen.getByText('Step content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    render(
      <StepCard>
        <p>First</p>
        <p>Second</p>
      </StepCard>
    );

    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
