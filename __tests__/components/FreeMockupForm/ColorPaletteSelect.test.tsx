import { vi } from 'vitest';

import { ColorPaletteSelect } from '@/components/FreeMockupForm/ColorPaletteSelect';

import { fireEvent, render } from '../../test-utils';

describe('ColorPaletteSelect', () => {
  it('renders the six translated options plus "no preference" as a radio group', () => {
    const { getAllByRole, getByText } = render(<ColorPaletteSelect value="" onChange={vi.fn()} />);

    expect(getAllByRole('radio')).toHaveLength(7);
    expect(getByText('Sober & minimalist')).toBeInTheDocument();
    expect(getByText('Lake & mountains')).toBeInTheDocument();
    expect(getByText('Alpine sunset')).toBeInTheDocument();
    expect(getByText('Deep forest')).toBeInTheDocument();
    expect(getByText('Starry night')).toBeInTheDocument();
    expect(getByText('Terracotta & stone')).toBeInTheDocument();
    expect(getByText('No preference')).toBeInTheDocument();
  });

  it('lets the visitor answer that they have no preference', () => {
    const onChange = vi.fn();
    const { getByRole } = render(<ColorPaletteSelect value="" onChange={onChange} />);

    fireEvent.click(getByRole('radio', { name: 'No preference' }));

    expect(onChange).toHaveBeenCalledWith('none');
  });

  it('undoes a pick through the "no preference" option', () => {
    const { getByRole } = render(<ColorPaletteSelect value="none" onChange={vi.fn()} />);

    expect(getByRole('radio', { name: 'No preference' })).toBeChecked();
    expect(getByRole('radio', { name: 'Deep forest' })).not.toBeChecked();
  });

  it('announces the group as optional', () => {
    const { getByText } = render(<ColorPaletteSelect value="" onChange={vi.fn()} />);

    expect(getByText('Optional')).toBeInTheDocument();
  });

  it('names the radio group after the palette question', () => {
    const { getByRole } = render(<ColorPaletteSelect value="" onChange={vi.fn()} />);

    expect(getByRole('radiogroup', { name: /Colour direction/ })).toBeInTheDocument();
  });

  it('leaves the group valid while no error is reported', () => {
    const { getByRole } = render(<ColorPaletteSelect value="" onChange={vi.fn()} />);

    expect(getByRole('radiogroup')).not.toHaveAttribute('aria-invalid');
  });

  it('checks only the selected option', () => {
    const { getByRole } = render(<ColorPaletteSelect value="deepForest" onChange={vi.fn()} />);

    expect(getByRole('radio', { name: 'Deep forest' })).toBeChecked();
    expect(getByRole('radio', { name: 'Starry night' })).not.toBeChecked();
  });

  it('reports the picked palette key', () => {
    const onChange = vi.fn();
    const { getByRole } = render(<ColorPaletteSelect value="" onChange={onChange} />);

    fireEvent.click(getByRole('radio', { name: 'Starry night' }));

    expect(onChange).toHaveBeenCalledWith('starryNight');
  });

  it('marks the group as touched on blur', () => {
    const onBlur = vi.fn();
    const { getByRole } = render(<ColorPaletteSelect value="" onChange={vi.fn()} onBlur={onBlur} />);

    fireEvent.blur(getByRole('radio', { name: 'Sober & minimalist' }));

    expect(onBlur).toHaveBeenCalled();
  });

  it('shows the translated error and marks the group invalid', () => {
    const { getByText, getByRole } = render(<ColorPaletteSelect value="" onChange={vi.fn()} error="required" />);

    const error = getByText('This field is required.');
    const group = getByRole('radiogroup');

    expect(error).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-describedby', error.id);
    expect(group).toHaveAttribute('aria-invalid', 'true');
  });
});
