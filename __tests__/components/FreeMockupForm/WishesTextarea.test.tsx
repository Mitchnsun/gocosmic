import { vi } from 'vitest';

import { WishesTextarea } from '@/components/FreeMockupForm/WishesTextarea';

import { fireEvent, render } from '../../test-utils';

describe('WishesTextarea', () => {
  it('renders a labelled, optional textarea', () => {
    const { getByLabelText, getByText } = render(<WishesTextarea value="" onChange={vi.fn()} />);

    expect(getByLabelText(/What you have in mind/)).toBeInTheDocument();
    expect(getByText('Optional')).toBeInTheDocument();
  });

  it('shows a live character counter', () => {
    const { getByText } = render(<WishesTextarea value="hello" onChange={vi.fn()} />);

    expect(getByText('5/500')).toBeInTheDocument();
  });

  it('caps the field at 500 characters', () => {
    const { getByLabelText } = render(<WishesTextarea value="" onChange={vi.fn()} />);

    expect(getByLabelText(/What you have in mind/)).toHaveAttribute('maxlength', '500');
  });

  it('reports what the visitor types', () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(<WishesTextarea value="" onChange={onChange} />);

    fireEvent.change(getByLabelText(/What you have in mind/), { target: { value: 'A calm page' } });

    expect(onChange).toHaveBeenCalledWith('A calm page');
  });

  it('marks the field as touched on blur', () => {
    const onBlur = vi.fn();
    const { getByLabelText } = render(<WishesTextarea value="" onChange={vi.fn()} onBlur={onBlur} />);

    fireEvent.blur(getByLabelText(/What you have in mind/));

    expect(onBlur).toHaveBeenCalled();
  });

  it('describes the textarea with the counter alone when valid', () => {
    const { getByLabelText } = render(<WishesTextarea value="hi" onChange={vi.fn()} />);
    const textarea = getByLabelText(/What you have in mind/);

    expect(textarea).toHaveAttribute('aria-describedby', 'free-mockup-wishes-counter');
    expect(textarea).not.toHaveAttribute('aria-invalid');
  });

  it('exposes the error to assistive technology', () => {
    const { getByLabelText, getByText } = render(
      <WishesTextarea value="hi" onChange={vi.fn()} error="wishes_too_long" />
    );
    const textarea = getByLabelText(/What you have in mind/);

    expect(getByText('Please keep your message under 500 characters.')).toBeInTheDocument();
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea.getAttribute('aria-describedby')).toContain('free-mockup-wishes-error');
  });
});
