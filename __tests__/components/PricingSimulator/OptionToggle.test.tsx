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
    const { container, rerender } = render(
      <OptionToggle label="Email" price="+10€" checked={false} onChange={() => {}} />
    );
    const checkbox = screen.getByRole('checkbox', { name: /email/i });
    expect(checkbox).toHaveClass('appearance-none', 'check-mark', 'border-fg-3', 'checked:bg-aerospace');

    rerender(<OptionToggle label="Email" price="+10€" checked onChange={() => {}} />);
    expect(container.firstChild).toHaveClass('border-aerospace', 'bg-aerospace/[0.06]', 'light:bg-aerospace/[0.03]');
  });

  it('adds no second tint to a ticked row nested in a ticked parent, so the orange price stays readable', () => {
    const { container } = render(<OptionToggle label="Redirects" price="+5€" checked nested onChange={() => {}} />);

    expect(container.firstChild).toHaveClass('border-aerospace');
    expect(container.firstChild).not.toHaveClass('bg-aerospace/[0.06]');
  });

  it('names the checkbox by its label and describes it with the hint and the price', () => {
    render(
      <OptionToggle label="Email" hint="Instead of a free one" price="+10€" checked={false} onChange={() => {}} />
    );

    const checkbox = screen.getByRole('checkbox', { name: 'Email' });
    expect(checkbox).toHaveAccessibleDescription('Instead of a free one +10€');
  });

  it('opens its info bubble without ticking the box', () => {
    const onChange = vi.fn();
    render(
      <OptionToggle
        label="Email"
        price="+10€"
        checked={false}
        onChange={onChange}
        info={{ label: 'More about: Email', text: 'Messages land in your inbox.' }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'More about: Email' }));

    expect(screen.getByRole('dialog', { name: 'Email' })).toHaveTextContent('Messages land in your inbox.');
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox', { name: 'Email' })).not.toBeChecked();
  });

  it('shows a commitment badge and a live note', () => {
    render(
      <OptionToggle
        label="News"
        price="+5€"
        checked
        onChange={() => {}}
        commitment="1-year commitment"
        note="Adjusted for you."
      />
    );

    expect(screen.getByText('1-year commitment')).toBeInTheDocument();
    expect(screen.getByText('Adjusted for you.')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('checkbox', { name: 'News' })).toHaveAccessibleDescription(
      '+5€ 1-year commitment Adjusted for you.'
    );
  });

  it('can lock its box while another option requires it', () => {
    render(<OptionToggle label="Updates" price="+20€" checked disabled onChange={() => {}} />);

    expect(screen.getByRole('checkbox', { name: 'Updates' })).toBeDisabled();
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
