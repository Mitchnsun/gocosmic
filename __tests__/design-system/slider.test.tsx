import { Slider } from '@/design-system/slider';

import { fireEvent, render } from '../test-utils';

describe('<Slider />', () => {
  it('should render a slider with min, max and current value', () => {
    const { getByRole } = render(<Slider value={[2]} min={0} max={4} step={1} onValueChange={() => {}} />);

    const slider = getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuemin', '0');
    expect(slider).toHaveAttribute('aria-valuemax', '4');
    expect(slider).toHaveAttribute('aria-valuenow', '2');
  });

  it('should call onValueChange when moved with the keyboard', () => {
    const onValueChange = vi.fn();
    const { getByRole } = render(<Slider value={[1]} min={0} max={4} step={1} onValueChange={onValueChange} />);

    fireEvent.keyDown(getByRole('slider'), { key: 'ArrowRight' });

    expect(onValueChange).toHaveBeenCalledWith([2]);
  });

  it('should be disabled when the disabled prop is true', () => {
    const { getByRole } = render(<Slider value={[0]} min={0} max={4} step={1} disabled onValueChange={() => {}} />);

    expect(getByRole('slider')).toHaveAttribute('data-disabled');
  });

  it('should forward aria-labelledby and aria-valuetext to the thumb', () => {
    const { getByRole } = render(
      <Slider
        value={[3]}
        min={0}
        max={4}
        step={1}
        onValueChange={() => {}}
        aria-labelledby="slider-label"
        aria-valuetext="6 to 8 pages"
      />
    );

    const slider = getByRole('slider');
    expect(slider).toHaveAttribute('aria-labelledby', 'slider-label');
    expect(slider).toHaveAttribute('aria-valuetext', '6 to 8 pages');
  });

  it('should apply a custom className to the root', () => {
    const { container } = render(
      <Slider value={[0]} min={0} max={4} step={1} onValueChange={() => {}} className="custom-class" />
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
