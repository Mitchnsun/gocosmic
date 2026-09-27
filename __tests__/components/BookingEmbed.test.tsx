import { fireEvent } from '@testing-library/react';

import { BookingEmbed, toBookingEmbedUrl } from '@/components/BookingEmbed';

import { render } from '../test-utils';

const BOOKING = 'https://calendar.google.com/calendar/appointments/schedules/abc123';

describe('toBookingEmbedUrl', () => {
  it('accepts Google Calendar booking pages and asks for the embeddable view', () => {
    expect(toBookingEmbedUrl(` ${BOOKING} `)).toBe(`${BOOKING}?gv=true`);
    expect(toBookingEmbedUrl(`${BOOKING}?gv=false`)).toBe(`${BOOKING}?gv=true`);
  });

  it.each([undefined, '', '   ', 'not a url', 'https://evil.example/calendar', 'http://calendar.google.com/x'])(
    'rejects %s',
    (value) => {
      expect(toBookingEmbedUrl(value)).toBeNull();
    }
  );
});

describe('BookingEmbed', () => {
  it('invites the visitor to write when no booking page is configured', () => {
    const { getByText, queryByRole } = render(<BookingEmbed url={null} />);

    expect(getByText(/online booking is not open yet/i)).toBeInTheDocument();
    expect(queryByRole('link')).not.toBeInTheDocument();
  });

  it('only loads the Google iframe once the visitor asks for it', () => {
    const url = `${BOOKING}?gv=true`;
    const { getByRole, getAllByRole, container } = render(<BookingEmbed url={url} />);

    expect(container.querySelector('iframe')).toBeNull();
    getAllByRole('link', { name: /open the booking page/i }).forEach((link) => {
      expect(link).toHaveAttribute('href', url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    fireEvent.click(getByRole('button', { name: 'Show the calendar' }));

    const iframe = container.querySelector('iframe');
    expect(iframe).toHaveAttribute('src', url);
    expect(iframe).toHaveAttribute('title', "Matthieu's booking calendar (Google Calendar)");
    expect(iframe).toHaveAttribute('loading', 'lazy');
  });
});
