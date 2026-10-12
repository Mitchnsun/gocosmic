import { renderHook } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

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

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it('renders false on the server so hydration matches, whatever the preference', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const Probe = () => <span>{String(usePrefersReducedMotion())}</span>;

    expect(renderToString(<Probe />)).toBe('<span>false</span>');
  });

  it('reads the preference right away in the browser', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });
});
