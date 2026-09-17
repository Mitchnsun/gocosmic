import { HoneypotField } from '@/components/FreeMockupForm/HoneypotField';

import { render } from '../../test-utils';

describe('HoneypotField', () => {
  it('renders an empty trap field hidden from people', () => {
    const { container } = render(<HoneypotField />);

    const field = container.querySelector('input[name="company"]');
    expect(field).toHaveAttribute('tabindex', '-1');
    expect(field).toHaveAttribute('autocomplete', 'off');
    expect(field).toHaveValue('');
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('sr-only');
  });
});
