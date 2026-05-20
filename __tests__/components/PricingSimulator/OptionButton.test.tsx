import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { OptionButton } from '@/components/PricingSimulator/OptionButton';

describe('OptionButton', () => {
  it('renders the label', () => {
    render(<OptionButton label="A website" selected={false} onClick={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'A website' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<OptionButton label="A website" selected={false} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'A website' }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when selected is true', () => {
    render(<OptionButton label="Option" selected={true} onClick={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Option' });
    expect(button).toHaveClass('border-blue-400');
  });

  it('applies unselected styles when selected is false', () => {
    render(<OptionButton label="Option" selected={false} onClick={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Option' });
    expect(button).toHaveClass('border-slate-600');
  });
});
