import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import CosmicCursor from '@/components/CosmicCursor';
import { useMagneticElements } from '@/components/CosmicCursor/useMagneticElements';

import { render } from '../test-utils';

// ─── Browser API mocks ───────────────────────────────────────────────────────

// jsdom does not implement matchMedia — provide a minimal stub
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ─── Canvas mock ────────────────────────────────────────────────────────────

const mockCtx = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  stroke: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  fillStyle: '' as string | CanvasGradient | CanvasPattern,
  strokeStyle: '' as string | CanvasGradient | CanvasPattern,
  lineWidth: 0,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype as any).getContext = vi.fn(() => mockCtx);

vi.stubGlobal(
  'requestAnimationFrame',
  vi.fn(() => 1)
);
vi.stubGlobal('cancelAnimationFrame', vi.fn());

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('CosmicCursor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders a canvas element', () => {
    const { container } = render(<CosmicCursor />);
    expect(container.querySelector('canvas')).not.toBeNull();
  });

  it('sets aria-hidden on the canvas', () => {
    const { container } = render(<CosmicCursor />);
    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies fixed positioning and pointer-events:none via inline style', () => {
    const { container } = render(<CosmicCursor />);
    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas.style.position).toBe('fixed');
    expect(canvas.style.pointerEvents).toBe('none');
    expect(canvas.style.zIndex).toBe('9999');
  });

  it('requests 2d context on mount', () => {
    render(<CosmicCursor />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('starts the animation loop via requestAnimationFrame', () => {
    render(<CosmicCursor />);
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it('cancels the animation frame on unmount', () => {
    const { unmount } = render(<CosmicCursor />);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it('restores cursor style on unmount', () => {
    const { unmount } = render(<CosmicCursor />);
    // After unmount the cursor should be reset to empty string
    unmount();
    expect(document.documentElement.style.cursor).toBe('');
  });

  it('removes the resize event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<CosmicCursor />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('accepts all custom prop overrides without throwing', () => {
    expect(() =>
      render(
        <CosmicCursor
          trailLength={12}
          trailDelay={20}
          orbitRadius={32}
          orbitCount={4}
          magneticRange={100}
          magneticEase={0.2}
          coreSize={8}
          trailSize={4}
        />
      )
    ).not.toThrow();
  });
});

// ─── useMagneticElements ─────────────────────────────────────────────────────

describe('useMagneticElements', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useMagneticElements([{ selector: 'button', accent: 'aerospace' }]));
    expect(result.current).toHaveProperty('current');
  });
});
