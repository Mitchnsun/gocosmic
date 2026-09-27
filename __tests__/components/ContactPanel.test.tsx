import { fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import { ContactPanel } from '@/components/ContactPanel';

import { render } from '../test-utils';

vi.mock('@/app/actions/contact', () => ({ submitContactMessage: vi.fn() }));

describe('ContactPanel', () => {
  it('opens on the message form, with the booking tab hidden', () => {
    const { getByRole } = render(<ContactPanel bookingUrl={null} />);

    expect(getByRole('tablist', { name: 'How would you like to get in touch?' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'Write a message' })).toHaveAttribute('aria-selected', 'true');
    expect(getByRole('tab', { name: 'Book a call' })).toHaveAttribute('tabindex', '-1');
    expect(getByRole('tabpanel', { name: 'Write a message' })).toContainElement(
      getByRole('button', { name: /Send my message/ })
    );
  });

  it('switches to the booking tab on click and with the arrow keys', () => {
    const { getByRole, getByText } = render(<ContactPanel bookingUrl={null} />);

    fireEvent.click(getByRole('tab', { name: 'Book a call' }));
    expect(getByRole('tab', { name: 'Book a call' })).toHaveAttribute('aria-selected', 'true');
    expect(getByText(/online booking is not open yet/i)).toBeVisible();

    fireEvent.keyDown(getByRole('tab', { name: 'Book a call' }), { key: 'ArrowRight' });
    expect(getByRole('tab', { name: 'Write a message' })).toHaveAttribute('aria-selected', 'true');
    expect(getByRole('tab', { name: 'Write a message' })).toHaveFocus();

    fireEvent.keyDown(getByRole('tab', { name: 'Write a message' }), { key: 'Enter' });
    expect(getByRole('tab', { name: 'Write a message' })).toHaveAttribute('aria-selected', 'true');
  });
});
