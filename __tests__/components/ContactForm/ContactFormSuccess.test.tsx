import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ContactFormSuccess } from '@/components/ContactForm/ContactFormSuccess';

import { render } from '../../test-utils';

describe('ContactFormSuccess', () => {
  const props = {
    title: 'Thank you!',
    description: 'We will come back to you shortly.',
    backLabel: 'Send another message',
  };

  it('announces the confirmation and takes focus', () => {
    const { getByRole } = render(<ContactFormSuccess {...props} onBack={vi.fn()} />);

    const status = getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveFocus();
    expect(getByRole('heading', { level: 3, name: 'Thank you!' })).toBeInTheDocument();
  });

  it('calls back when the visitor wants to send another message', async () => {
    const onBack = vi.fn();
    const { getByRole } = render(<ContactFormSuccess {...props} onBack={onBack} />);

    await userEvent.click(getByRole('button', { name: 'Send another message' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
