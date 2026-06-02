import { act, renderHook } from '@testing-library/react';

import { useMobileMenu } from '@/components/Header/useMobileMenu';

let mockPathname = '/en';
vi.mock('@/i18n/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  Link: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  redirect: vi.fn(),
  getPathname: vi.fn(() => '/en'),
}));

describe('useMobileMenu', () => {
  beforeEach(() => {
    mockPathname = '/en';
    document.body.style.overflow = '';
  });

  afterEach(() => {
    document.body.style.overflow = '';
  });

  it('starts closed', () => {
    const { result } = renderHook(() => useMobileMenu());
    expect(result.current.isOpen).toBe(false);
  });

  it('open() sets isOpen to true', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('close() sets isOpen to false', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggle() alternates isOpen', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
  });

  it('locks body scroll when open', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('unlocks body scroll when closed', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    act(() => result.current.close());
    expect(document.body.style.overflow).toBe('');
  });

  it('unlocks body scroll on unmount', () => {
    const { result, unmount } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes on Escape key when open', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('focuses the button after closing with Escape', () => {
    const { result } = renderHook(() => useMobileMenu());
    const btn = document.createElement('button');
    const focusSpy = vi.spyOn(btn, 'focus');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result.current.buttonRef as any).current = btn;
    act(() => result.current.open());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    });
    expect(focusSpy).toHaveBeenCalledTimes(1);
    expect(result.current.isOpen).toBe(false);
  });

  it('ignores non-Escape keydown events', () => {
    const { result } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('closes on route change', () => {
    const { result, rerender } = renderHook(() => useMobileMenu());
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => {
      mockPathname = '/about';
    });
    rerender();
    expect(result.current.isOpen).toBe(false);
  });

  it('exposes a buttonRef', () => {
    const { result } = renderHook(() => useMobileMenu());
    expect(result.current.buttonRef).toBeDefined();
    expect(result.current.buttonRef.current).toBeNull();
  });
});
