import { describe, expect, it, vi } from 'vitest';

import { FormField } from '@/components/ContactForm/FormField';

import { render } from '../../test-utils';

describe('FormField', () => {
  it('labels the control and marks it required', () => {
    const { getByLabelText } = render(
      <FormField name="name" label="Name" value="Ada" onChange={vi.fn()} required placeholder="Your name" />
    );

    const input = getByLabelText(/Name/);
    expect(input).toHaveValue('Ada');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('placeholder', 'Your name');
  });

  it('wires the error message to the control', () => {
    const { getByLabelText, getByText } = render(
      <FormField name="email" label="Email" value="" onChange={vi.fn()} error="Invalid email" />
    );

    const input = getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'email-error');
    expect(getByText('Invalid email')).toHaveAttribute('id', 'email-error');
  });

  it('renders a textarea in multiline mode', () => {
    const { getByLabelText } = render(
      <FormField name="message" label="Message" value="" onChange={vi.fn()} multiline rows={4} />
    );

    const textarea = getByLabelText('Message');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('reports changes', async () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(<FormField name="name" label="Name" value="" onChange={onChange} />);

    const { default: userEvent } = await import('@testing-library/user-event');
    await userEvent.type(getByLabelText('Name'), 'A');

    expect(onChange).toHaveBeenCalled();
  });
});
