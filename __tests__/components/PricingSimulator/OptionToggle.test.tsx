import { OptionToggle } from '@/components/PricingSimulator/OptionToggle';

import { fireEvent, render, screen } from '../../test-utils';

describe('OptionToggle', () => {
  it('renders the label, hint and surcharge', () => {
    render(
      <OptionToggle
        label="Email address"
        hint="Instead of a free one"
        price="+10€"
        checked={false}
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Email address')).toBeInTheDocument();
    expect(screen.getByText('Instead of a free one')).toBeInTheDocument();
    expect(screen.getByText('+10€')).toBeInTheDocument();
  });

  it('exposes the checked state to assistive tech', () => {
    const { rerender } = render(<OptionToggle label="Email" price="+10€" checked={false} onChange={() => {}} />);
    expect(screen.getByRole('checkbox', { name: /email/i })).not.toBeChecked();

    rerender(<OptionToggle label="Email" price="+10€" checked onChange={() => {}} />);
    expect(screen.getByRole('checkbox', { name: /email/i })).toBeChecked();
  });

  it('keeps a real checkbox, restyled for both themes, and outlines the ticked row in orange', () => {
    const { rerender } = render(<OptionToggle label="Email" price="+10€" checked={false} onChange={() => {}} />);
    const checkbox = screen.getByRole('checkbox', { name: /email/i });
    expect(checkbox).toHaveClass('appearance-none', 'check-mark', 'border-fg-3', 'checked:bg-aerospace');

    rerender(<OptionToggle label="Email" price="+10€" checked onChange={() => {}} />);
    expect(checkbox.closest('div')).toHaveClass('border-aerospace', 'bg-aerospace/[0.06]');
  });

  it('calls onChange when toggled', () => {
    const onChange = vi.fn();
    render(<OptionToggle label="Email" price="+10€" checked={false} onChange={onChange} />);

    fireEvent.click(screen.getByRole('checkbox', { name: /email/i }));

    expect(onChange).toHaveBeenCalledOnce();
  });

  it('renders nested content such as a dependent slider', () => {
    render(
      <OptionToggle label="Updates" price="+5€" checked onChange={() => {}}>
        <p>nested</p>
      </OptionToggle>
    );

    expect(screen.getByText('nested')).toBeInTheDocument();
  });
});
