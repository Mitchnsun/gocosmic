import { TierSlider } from '@/components/PricingSimulator/TierSlider';

import { fireEvent, render, screen } from '../../test-utils';

const tiers = [
  { label: '1 page', price: '+0€' },
  { label: '2 to 3 pages', price: '+5€' },
  { label: '4 to 5 pages', price: '+10€' },
  { label: '6 to 8 pages', price: '+20€' },
  { label: '9 to 10 pages', price: '+25€' },
];

describe('TierSlider', () => {
  it('renders a labelled range covering the five positions', () => {
    render(<TierSlider label="Number of pages" tiers={tiers} value={0} onChange={() => {}} />);

    const slider = screen.getByRole('slider', { name: 'Number of pages' });
    expect(slider).toHaveAttribute('min', '0');
    expect(slider).toHaveAttribute('max', '4');
    expect(slider).toHaveAttribute('step', '1');
  });

  it('shows the wording and price of the current position', () => {
    render(<TierSlider label="Number of pages" tiers={tiers} value={2} onChange={() => {}} />);

    expect(screen.getByText('4 to 5 pages')).toBeInTheDocument();
    expect(screen.getByText('+10€')).toBeInTheDocument();
  });

  it('reads the tier out rather than the raw index', () => {
    render(<TierSlider label="Number of pages" tiers={tiers} value={3} onChange={() => {}} />);

    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '6 to 8 pages — +20€');
  });

  it('reports the new position as a number', () => {
    const onChange = vi.fn();
    render(<TierSlider label="Number of pages" tiers={tiers} value={0} onChange={onChange} />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('can be disabled while its option is off', () => {
    render(<TierSlider label="Number of pages" tiers={tiers} value={0} onChange={() => {}} disabled />);

    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
