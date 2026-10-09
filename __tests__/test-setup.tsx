// extends Vitest's expect method with methods from react-testing-library
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/en',
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string | { pathname: string; hash?: string };
    [key: string]: unknown;
  }) => {
    const resolvedHref = typeof href === 'string' ? href : `${href.pathname}${href.hash ? `#${href.hash}` : ''}`;
    return (
      <a href={resolvedHref} {...props}>
        {children}
      </a>
    );
  },
  redirect: vi.fn(),
  getPathname: vi.fn(() => '/en'),
}));

// Mock motion/react so JSDOM doesn't process animation props
vi.mock('motion/react', () => {
  type StrippedProps = Record<'animate' | 'initial' | 'exit' | 'transition' | 'variants' | 'custom', unknown> & {
    children?: React.ReactNode;
    [key: string]: unknown;
  };
  const strip = (Tag: 'span' | 'div' | 'li' | 'ul') => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- animation props must not reach the DOM
    const Stripped = ({ children, animate, initial, exit, transition, variants, custom, ...rest }: StrippedProps) => (
      <Tag {...rest}>{children}</Tag>
    );
    return Stripped;
  };
  const components = { span: strip('span'), div: strip('div'), li: strip('li'), ul: strip('ul') };

  return {
    motion: components,
    m: components,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    // Fetches lazy features like the real one, so the loader is exercised, then renders as a fragment.
    LazyMotion: ({ children, features }: { children: React.ReactNode; features?: unknown }) => {
      if (typeof features === 'function') void features();
      return <>{children}</>;
    },
    domAnimation: {},
    useReducedMotion: (): boolean => false,
  };
});

// Mock ResizeObserver, which jsdom does not implement
global.ResizeObserver = class ResizeObserver {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
};

// Stub the canvas context, which jsdom does not implement; tests that draw override it
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

// Mock IntersectionObserver for scroll-based components
global.IntersectionObserver = class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: readonly number[] = [];

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.root = options?.root ?? null;
    this.rootMargin = options?.rootMargin ?? '';
    this.thresholds =
      options?.threshold == null ? [] : Array.isArray(options.threshold) ? options.threshold : [options.threshold];
  }

  observe(target: Element) {
    this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this);
  }

  unobserve() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Mock window.matchMedia for components that use prefers-reduced-motion
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
