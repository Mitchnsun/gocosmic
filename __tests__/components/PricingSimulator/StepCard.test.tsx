import { StepCard } from '@/components/PricingSimulator/StepCard';

import { render } from '../../test-utils';

describe('StepCard', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <StepCard>
        <p>Step content</p>
      </StepCard>
    );

    expect(getByText('Step content')).toBeInTheDocument();
  });

  it('renders multiple children', () => {
    const { getByText } = render(
      <StepCard>
        <p>First</p>
        <p>Second</p>
      </StepCard>
    );

    expect(getByText('First')).toBeInTheDocument();
    expect(getByText('Second')).toBeInTheDocument();
  });
});
