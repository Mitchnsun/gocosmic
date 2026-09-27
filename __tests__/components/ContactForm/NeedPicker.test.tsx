import { describe, expect, it, vi } from 'vitest';

import { NeedPicker } from '@/components/ContactForm/NeedPicker';

import { render } from '../../test-utils';

const OPTIONS = [
  { value: 'showcase', label: 'Showcase site' },
  { value: 'shop', label: 'Online shop' },
] as const;

describe('NeedPicker', () => {
  it('renders a radio group with the legend', () => {
    const { getByRole } = render(
      <NeedPicker legend="What you need" options={[...OPTIONS]} value="" onChange={vi.fn()} />
    );

    expect(getByRole('group', { name: 'What you need' })).toBeInTheDocument();
    expect(getByRole('radio', { name: 'Showcase site' })).toBeInTheDocument();
  });

  it('wires the error message to the group', () => {
    const { getByRole, getByText } = render(
      <NeedPicker
        legend="What you need"
        options={[...OPTIONS]}
        value=""
        onChange={vi.fn()}
        error="Please pick an option from the list."
      />
    );

    expect(getByRole('group', { name: 'What you need' })).toHaveAttribute('aria-describedby', 'need-error');
    expect(getByText('Please pick an option from the list.')).toHaveAttribute('id', 'need-error');
  });

  it('has no error state by default', () => {
    const { getByRole, queryByText } = render(
      <NeedPicker legend="What you need" options={[...OPTIONS]} value="" onChange={vi.fn()} />
    );

    expect(getByRole('group', { name: 'What you need' })).not.toHaveAttribute('aria-describedby');
    expect(queryByText('Please pick an option from the list.')).not.toBeInTheDocument();
  });
});
