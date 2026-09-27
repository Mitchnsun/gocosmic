import { renderHook } from '@testing-library/react';

import { STATUS_BAR_HEIGHT } from '@/components/Header/constants';
import { useStatusBarOffset } from '@/components/Header/useStatusBarOffset';

describe('useStatusBarOffset', () => {
  afterEach(() => {
    window.scrollY = 0;
  });

  it('reserves the full status bar height at the top of the page', () => {
    window.scrollY = 0;
    const { result } = renderHook(() => useStatusBarOffset());
    expect(result.current).toBe(STATUS_BAR_HEIGHT);
  });

  it('shrinks as the status bar scrolls away', () => {
    window.scrollY = 10;
    const { result } = renderHook(() => useStatusBarOffset());
    expect(result.current).toBe(STATUS_BAR_HEIGHT - 10);
  });

  it('never goes below zero once the status bar has fully scrolled away', () => {
    window.scrollY = STATUS_BAR_HEIGHT + 100;
    const { result } = renderHook(() => useStatusBarOffset());
    expect(result.current).toBe(0);
  });
});
