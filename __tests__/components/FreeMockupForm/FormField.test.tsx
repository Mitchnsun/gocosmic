import { FormField } from '@/components/FreeMockupForm/FormField';

import { render } from '../../test-utils';

describe('FormField', () => {
  it('links the label to the control', () => {
    const { getByLabelText } = render(
      <FormField id="demo" label="Your email">
        <input id="demo" />
      </FormField>
    );

    expect(getByLabelText('Your email')).toBeInTheDocument();
  });

  it('renders the optional hint next to the label', () => {
    const { getByText } = render(
      <FormField id="demo" label="Your website" hint="Optional">
        <input id="demo" />
      </FormField>
    );

    expect(getByText('Optional')).toBeInTheDocument();
  });

  it('renders the error under an id the control can point at', () => {
    const { getByText, queryByText, rerender } = render(
      <FormField id="demo" label="Your email">
        <input id="demo" />
      </FormField>
    );

    expect(queryByText('Invalid')).not.toBeInTheDocument();

    rerender(
      <FormField id="demo" label="Your email" error="Invalid">
        <input id="demo" />
      </FormField>
    );

    expect(getByText('Invalid')).toHaveAttribute('id', 'demo-error');
  });
});
