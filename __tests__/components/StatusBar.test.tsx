import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StatusBar } from '@/components/StatusBar';
import { formatStartMonth } from '@/components/StatusBar/StatusBar.utils';

import { render } from '../test-utils';

describe('StatusBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-23T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('announces the availability and the month new projects can start', () => {
    const { getByText } = render(<StatusBar availability={{ status: 'available', startMonth: '2026-10' }} />);
    expect(getByText('Available')).toBeInTheDocument();
    expect(getByText('· New projects from October')).toBeInTheDocument();
  });

  it('pulses the jungle signal dot only while available, and stops under reduced motion', () => {
    const { container } = render(<StatusBar availability={{ status: 'available', startMonth: '2026-10' }} />);
    const ping = container.querySelector('.animate-ping');
    expect(ping).toHaveClass('bg-jungle', 'motion-reduce:animate-none');
    expect(ping?.parentElement).toHaveAttribute('aria-hidden', 'true');
  });

  it('announces a fully booked calendar with a static dot', () => {
    const { getByText, container } = render(<StatusBar availability={{ status: 'booked', startMonth: '2027-01' }} />);
    expect(getByText('Fully booked')).toBeInTheDocument();
    expect(getByText('· Next openings in January')).toBeInTheDocument();
    expect(container.querySelector('.animate-ping')).not.toBeInTheDocument();
    expect(container.querySelector('.bg-ghost\\/40')).toBeInTheDocument();
  });

  it('never announces a month that has already gone by', () => {
    const { getByText } = render(<StatusBar availability={{ status: 'available', startMonth: '2026-03' }} />);
    expect(getByText('· New projects from September')).toBeInTheDocument();
  });

  it('uses the studio schedule by default', () => {
    const { getByRole } = render(<StatusBar />);
    expect(getByRole('status')).toHaveTextContent(/New projects from/);
  });

  it('shows the studio base and its coordinates', () => {
    const { getByText } = render(<StatusBar />);
    expect(getByText('Chêne-Bougeries · 46.2°N 6.2°E')).toBeInTheDocument();
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
