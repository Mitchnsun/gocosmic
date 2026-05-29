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
vi.mock('motion/react', () => ({
  motion: {
    span: ({
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initial,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exit,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transition,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variants,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      custom,
      ...rest
    }: {
      children?: React.ReactNode;
      animate?: unknown;
      initial?: unknown;
      exit?: unknown;
      transition?: unknown;
      variants?: unknown;
      custom?: unknown;
      [key: string]: unknown;
    }) => <span {...(rest as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>,
    div: ({
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initial,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exit,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transition,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variants,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      custom,
      ...rest
    }: {
      children?: React.ReactNode;
      animate?: unknown;
      initial?: unknown;
      exit?: unknown;
      transition?: unknown;
      variants?: unknown;
      custom?: unknown;
      [key: string]: unknown;
    }) => <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
    li: ({
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initial,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exit,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transition,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variants,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      custom,
      ...rest
    }: {
      children?: React.ReactNode;
      animate?: unknown;
      initial?: unknown;
      exit?: unknown;
      transition?: unknown;
      variants?: unknown;
      custom?: unknown;
      [key: string]: unknown;
    }) => <li {...(rest as React.HTMLAttributes<HTMLLIElement>)}>{children}</li>,
    ul: ({
      children,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      animate,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      initial,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exit,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      transition,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variants,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      custom,
      ...rest
    }: {
      children?: React.ReactNode;
      animate?: unknown;
      initial?: unknown;
      exit?: unknown;
      transition?: unknown;
      variants?: unknown;
      custom?: unknown;
      [key: string]: unknown;
    }) => <ul {...(rest as React.HTMLAttributes<HTMLUListElement>)}>{children}</ul>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: (): boolean => false,
}));

// Mock ResizeObserver for @react-three/fiber Canvas component
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

// Mock IntersectionObserver for scroll-based components
global.IntersectionObserver = class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

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
} as unknown as typeof IntersectionObserver;

// Mock window.matchMedia for components that use prefers-reduced-motion
if (!window.matchMedia) {
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
}
