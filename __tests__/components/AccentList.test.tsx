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

  it('renders the label as a paragraph by default', () => {
    const { getByText, queryByRole } = render(<AccentList items={['First']} label="Technologies" />);

    expect(getByText('Technologies').tagName).toBe('P');
    expect(queryByRole('heading')).not.toBeInTheDocument();
  });

  it('renders the label at the requested heading level', () => {
    const { getByRole, rerender } = render(<AccentList items={['First']} label="Technologies" labelAs="h3" />);

    expect(getByRole('heading', { level: 3, name: 'Technologies' })).toBeInTheDocument();

    rerender(<AccentList items={['First']} label="Technologies" labelAs="h4" />);
    expect(getByRole('heading', { level: 4, name: 'Technologies' })).toBeInTheDocument();
  });
});
