import { describe, expect, it } from 'vitest';

import { AccentList } from '@/components/AccentList';

import { render } from '../test-utils';

describe('AccentList', () => {
  it('renders every item', () => {
    const { getByRole, getAllByRole } = render(<AccentList items={['First', 'Second']} ariaLabel="Features" />);

    expect(getByRole('list', { name: 'Features' })).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders a visible label instead of the aria-label', () => {
    const { getByText, getByRole } = render(<AccentList items={['First']} label="Technologies" ariaLabel="Ignored" />);

    expect(getByText('Technologies')).toBeInTheDocument();
    expect(getByRole('list')).not.toHaveAttribute('aria-label');
  });

  it('switches to two columns when asked', () => {
    const { getByRole } = render(<AccentList items={['First']} columns={2} ariaLabel="Items" />);

    expect(getByRole('list').className).toContain('md:grid-cols-2');
  });

  it('applies the accent colour to the bullets', () => {
    const { container } = render(<AccentList items={['First']} accent="jungle" ariaLabel="Items" />);

    expect(container.querySelector('.bg-jungle')).toBeInTheDocument();
  });
});
