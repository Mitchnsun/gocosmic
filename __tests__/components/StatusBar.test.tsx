import { describe, expect, it } from 'vitest';

import { StatusBar } from '@/components/StatusBar';
import { formatStartMonth } from '@/components/StatusBar/StatusBar.utils';

import { render } from '../test-utils';

describe('StatusBar', () => {
  it('announces availability with a pulsing signal dot', () => {
    const { getByText, container } = render(
      <StatusBar availability={{ status: 'available', startMonth: '2026-10' }} />
    );
    expect(getByText('Available')).toBeInTheDocument();
    const ping = container.querySelector('.animate-ping');
    expect(ping).toHaveClass('bg-ok', 'motion-reduce:animate-none');
    expect(ping?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('shows a fully booked calendar with a static dot, no month', () => {
    const { getByText, container, queryByText } = render(
      <StatusBar availability={{ status: 'booked', startMonth: '2027-01' }} />
    );
    expect(getByText('Fully booked')).toBeInTheDocument();
    expect(queryByText(/January/)).not.toBeInTheDocument();
    expect(container.querySelector('.animate-ping')).not.toBeInTheDocument();
    expect(container.querySelector('.bg-fg-3')).toBeInTheDocument();
  });

  it('uses the studio schedule by default', () => {
    const { getByRole } = render(<StatusBar />);
    expect(getByRole('status')).toHaveTextContent(/Available/);
  });

  it('shows the region-aware studio base and altitude, defaulting to Annecy', () => {
    const { getByText } = render(<StatusBar />);
    expect(getByText('Mission control · Annecy · Alt. 447m')).toBeInTheDocument();
  });

  it('shows Chêne-Bougeries for Swiss visitors', () => {
    const { getByText } = render(<StatusBar region="ch" />);
    expect(getByText('Mission control · Chêne-Bougeries · Alt. 424m')).toBeInTheDocument();
  });

  it('exposes a labelled status region without live announcements', () => {
    const { getByRole } = render(<StatusBar />);
    const bar = getByRole('status', { name: 'Studio availability' });
    expect(bar).toHaveAttribute('aria-live', 'off');
  });
});

describe('formatStartMonth', () => {
  const now = new Date('2026-09-23T10:00:00Z');

  it('localises the configured month', () => {
    expect(formatStartMonth('2026-10', 'fr', now)).toBe('octobre');
    expect(formatStartMonth('2026-10', 'de', now)).toBe('Oktober');
  });

  it('falls back to the current month when the configured one is past', () => {
    expect(formatStartMonth('2026-08', 'en', now)).toBe('September');
  });

  it('falls back to the current month when the value is unreadable', () => {
    expect(formatStartMonth('soon', 'en', now)).toBe('September');
  });

  it('defaults to the current date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
    expect(formatStartMonth('2020-01', 'en')).toBe('September');
    vi.useRealTimers();
  });
});
