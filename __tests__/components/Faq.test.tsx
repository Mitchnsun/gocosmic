import { fireEvent } from '@testing-library/react';

import { Faq } from '@/components/Faq';

import { render } from '../test-utils';

const items = [
  { question: 'Do I own the site?', answer: 'Yes, your content is yours.' },
  { question: 'How long?', answer: 'Two to three weeks.' },
];

describe('Faq', () => {
  it('opens the first answer by default and wires each button to its region', () => {
    const { getByRole, getByText } = render(<Faq eyebrow="[ FAQ ]" title="Questions" items={items} />);

    const first = getByRole('button', { name: 'Do I own the site?' });
    const second = getByRole('button', { name: 'How long?' });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');
    expect(getByRole('region', { name: 'Do I own the site?' })).toHaveTextContent('Yes, your content is yours.');
    expect(document.getElementById(second.getAttribute('aria-controls') ?? '')).toHaveAttribute('hidden');
    expect(getByText('Two to three weeks.')).not.toBeVisible();
  });

  it('keeps a single answer open at a time and can close it', () => {
    const { getByRole } = render(<Faq eyebrow="[ FAQ ]" title="Questions" items={items} />);

    fireEvent.click(getByRole('button', { name: 'How long?' }));
    expect(getByRole('button', { name: 'How long?' })).toHaveAttribute('aria-expanded', 'true');
    expect(getByRole('button', { name: 'Do I own the site?' })).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(getByRole('button', { name: 'How long?' }));
    expect(getByRole('button', { name: 'How long?' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('can start with every answer closed', () => {
    const { getAllByRole } = render(<Faq eyebrow="[ FAQ ]" title="Questions" items={items} defaultOpen={-1} />);

    getAllByRole('button').forEach((button) => expect(button).toHaveAttribute('aria-expanded', 'false'));
  });
});
