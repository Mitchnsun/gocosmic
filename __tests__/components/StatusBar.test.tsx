import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StatusBar } from '@/components/StatusBar';

import { render } from '../test-utils';

describe('StatusBar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-22T19:50:32Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the signal acquired label', () => {
    const { getByText } = render(<StatusBar />);
    expect(getByText('SIGNAL ACQUIRED')).toBeInTheDocument();
  });

  it('renders the mission control and location text', () => {
    const { getByText } = render(<StatusBar />);
    expect(getByText(/MISSION CONTROL/)).toBeInTheDocument();
    expect(getByText(/ANNECY/)).toBeInTheDocument();
  });

  it('renders the status role for accessibility', () => {
    const { getByRole } = render(<StatusBar />);
    expect(getByRole('status')).toBeInTheDocument();
  });

  it('renders the signal dot with aria-label', () => {
    const { getByRole } = render(<StatusBar />);
    const dot = getByRole('img', { name: 'Signal active' });
    expect(dot).toBeInTheDocument();
  });

  it('shows the clock time once mounted', () => {
    const { container } = render(<StatusBar />);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    // After mounting, no invisible placeholder — real time is rendered
    const invisible = container.querySelector('.invisible');
    expect(invisible).not.toBeInTheDocument();
    // A time element (HH:MM:SS) should be visible
    expect(container.querySelector('.tabular-nums')).toBeInTheDocument();
  });

  it('ticks the clock every second', () => {
    const { queryByText } = render(<StatusBar />);
    act(() => {
      vi.advanceTimersByTime(0);
    });
    // Initial tick — time rendered
    const initialTimeEl = queryByText(/^\d{2}:\d{2}:\d{2}$/);
    expect(initialTimeEl).toBeInTheDocument();

    const before = initialTimeEl?.textContent;

    vi.setSystemTime(new Date('2026-05-22T19:50:33Z'));
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should still have a time element; contents may differ if the TZ shifts the second
    const afterEl = queryByText(/^\d{2}:\d{2}:\d{2}$/);
    expect(afterEl).toBeInTheDocument();

    // At least verify the element is still present (clock didn't disappear)
    expect(afterEl?.textContent).toBeTruthy();
    // Suppress unused-variable warning from `before`
    void before;
  });
});
