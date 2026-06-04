import { renderHook, waitFor } from '@testing-library/react';

import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

describe('usePrefersReducedMotion', () => {
  const originalMatchMedia = window.matchMedia;

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('returns false when matchMedia is unavailable', () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => usePrefersReducedMotion(true));

    expect(result.current).toBe(false);
  });

  it('syncs the current media query value when enabled becomes true', async () => {
    let matches = false;

    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result, rerender } = renderHook(({ enabled }) => usePrefersReducedMotion(enabled), {
      initialProps: { enabled: false },
    });

    matches = true;
    rerender({ enabled: true });

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
