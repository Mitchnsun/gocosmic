import { Field, FIELD_INPUT } from '@/design-system/field';

import { render } from '../test-utils';

describe('Field', () => {
  it('links the label to the control', () => {
    const { getByLabelText } = render(
      <Field id="demo" label="Your email">
        <input id="demo" />
      </Field>
    );

    expect(getByLabelText('Your email')).toBeInTheDocument();
  });

  it('renders the optional hint next to the label', () => {
    const { getByText } = render(
      <Field id="demo" label="Your website" hint="Optional">
        <input id="demo" />
      </Field>
    );

    expect(getByText('Optional')).toBeInTheDocument();
  });

  it('renders the error under an id the control can point at', () => {
    const { getByText, queryByText, rerender } = render(
      <Field id="demo" label="Your email">
        <input id="demo" />
      </Field>
    );

    expect(queryByText('Invalid')).not.toBeInTheDocument();

    rerender(
      <Field id="demo" label="Your email" error="Invalid">
        <input id="demo" />
      </Field>
    );

    expect(getByText('Invalid')).toHaveAttribute('id', 'demo-error');
  });

  it('marks a required field with a decorative asterisk', () => {
    const { getByText } = render(
      <Field id="demo" label="Name" required>
        <input id="demo" className={FIELD_INPUT} />
      </Field>
    );

    expect(getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });
});
