import { describe, expect, it } from 'vitest';

import { CONTACT_CHANNELS, ContactChannels } from '@/components/ContactChannels';

import { render } from '../test-utils';

describe('ContactChannels', () => {
  it('renders one card per channel with its email and prefilled mailto link', () => {
    const { getByRole, getByText } = render(<ContactChannels ariaLabel="Direct lines" />);

    const list = getByRole('list', { name: 'Direct lines' });
    expect(list.children).toHaveLength(CONTACT_CHANNELS.length);
    expect(getByText('contact@gocosmic.dev')).toBeInTheDocument();

    const link = getByRole('link', {
      name: 'Send an email to contact@gocosmic.dev with subject: General Inquiry',
    });
    expect(link).toHaveAttribute('href', 'mailto:contact@gocosmic.dev?subject=General%20Inquiry');
  });

  it('exposes each channel name as a heading so it can be reached by heading navigation', () => {
    const { getAllByRole, getByRole } = render(<ContactChannels ariaLabel="Direct lines" />);

    expect(getAllByRole('heading', { level: 3 })).toHaveLength(CONTACT_CHANNELS.length);
    for (const name of ['General Inquiries', 'Support & Assistance', 'Technical Inquiries', 'Commercial Inquiries']) {
      expect(getByRole('heading', { level: 3, name })).toBeInTheDocument();
    }
  });

  it('lists the reasons of each channel', () => {
    const { getByText } = render(<ContactChannels ariaLabel="Direct lines" />);

    expect(getByText('Partnership proposals')).toBeInTheDocument();
    expect(getByText('Bug or error reporting')).toBeInTheDocument();
  });
});
