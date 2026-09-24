import { ContactDetails } from '@/components/ContactDetails';

import { render } from '../test-utils';

describe('ContactDetails', () => {
  const details = [
    { label: 'Email', value: 'contact@gocosmic.dev', href: 'mailto:contact@gocosmic.dev' },
    { label: 'Where', value: 'Geneva, or by video call' },
  ];

  it('lists the contact lines, linking the addresses', () => {
    const { getByRole, getByText } = render(
      <ContactDetails details={details} status="Available · New projects from October" available ariaLabel="Details" />
    );

    expect(getByRole('link', { name: 'contact@gocosmic.dev' })).toHaveAttribute('href', 'mailto:contact@gocosmic.dev');
    expect(getByText('Geneva, or by video call').tagName).toBe('DD');
    expect(getByText('Available · New projects from October')).toBeInTheDocument();
  });

  it('pulses the green dot only while available', () => {
    const { container, rerender } = render(
      <ContactDetails details={details} status="Available" available ariaLabel="Details" />
    );
    expect(container.querySelector('.animate-ping')).toHaveClass('motion-reduce:animate-none');

    rerender(<ContactDetails details={details} status="Fully booked" available={false} ariaLabel="Details" />);
    expect(container.querySelector('.animate-ping')).toBeNull();
  });
});
