import { vi } from 'vitest';

import { ColorPaletteSelect } from '@/components/FreeMockupForm/ColorPaletteSelect';

import { fireEvent, render } from '../../test-utils';

describe('ColorPaletteSelect', () => {
  it('renders the six translated options as a radio group', () => {
    const { getAllByRole, getByText } = render(<ColorPaletteSelect value="" onChange={vi.fn()} />);

    expect(getAllByRole('radio')).toHaveLength(6);
    expect(getByText('Sober & minimalist')).toBeInTheDocument();
    expect(getByText('Lake & mountains')).toBeInTheDocument();
    expect(getByText('Alpine sunset')).toBeInTheDocument();
    expect(getByText('Deep forest')).toBeInTheDocument();
    expect(getByText('Starry night')).toBeInTheDocument();
    expect(getByText('Terracotta & stone')).toBeInTheDocument();
  });

  it('labels the group with the palette question', () => {
    const { getByText } = render(<ColorPaletteSelect value="" onChange={vi.fn()} />);

    expect(getByText('Colour direction')).toBeInTheDocument();
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

  it('shows the translated error and points the group at it', () => {
    const { getByText, getByRole } = render(<ColorPaletteSelect value="" onChange={vi.fn()} error="required" />);

    const error = getByText('This field is required.');
    expect(error).toBeInTheDocument();
    expect(getByRole('group')).toHaveAttribute('aria-describedby', error.id);
  });
});
