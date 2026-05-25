import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useWordCycler } from '@/components/HeroSection/HeroSection.hooks';

describe('useWordCycler', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns the first word initially', () => {
    const { result } = renderHook(() => useWordCycler(['shine', 'soar', 'inspire'], 5000, false));
    expect(result.current).toBe('shine');
  });

  it('advances to the next word after the interval', () => {
    const { result } = renderHook(() => useWordCycler(['shine', 'soar', 'inspire'], 5000, false));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe('soar');
  });

  it('wraps around after the last word', () => {
    const { result } = renderHook(() => useWordCycler(['shine', 'soar'], 5000, false));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe('shine');
  });

  it('does not cycle when disabled is true', () => {
    const { result } = renderHook(() => useWordCycler(['shine', 'soar'], 5000, true));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current).toBe('shine');
  });

  it('does not cycle when the list has only one entry', () => {
    const { result } = renderHook(() => useWordCycler(['shine'], 5000, false));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(result.current).toBe('shine');
  });

  it('clears the interval on unmount', () => {
    const clearSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() => useWordCycler(['shine', 'soar'], 5000, false));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('returns empty string for an empty words array', () => {
    const { result } = renderHook(() => useWordCycler([], 5000, false));
    expect(result.current).toBe('');
  });
});
