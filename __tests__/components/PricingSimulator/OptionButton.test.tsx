import { vi } from 'vitest';

import { OptionButton } from '@/components/PricingSimulator/OptionButton';

import { fireEvent, render } from '../../test-utils';

describe('OptionButton', () => {
  it('renders the label', () => {
    const { getByRole } = render(<OptionButton label="A website" selected={false} onClick={vi.fn()} />);

    expect(getByRole('button', { name: 'A website' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    const { getByRole } = render(<OptionButton label="A website" selected={false} onClick={handleClick} />);

    fireEvent.click(getByRole('button', { name: 'A website' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('has aria-pressed="true" when selected', () => {
    const { getByRole } = render(<OptionButton label="Option" selected={true} onClick={vi.fn()} />);

    const button = getByRole('button', { name: 'Option' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('has aria-pressed="false" when not selected', () => {
    const { getByRole } = render(<OptionButton label="Option" selected={false} onClick={vi.fn()} />);

    const button = getByRole('button', { name: 'Option' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });
});
