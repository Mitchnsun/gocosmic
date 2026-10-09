import { act } from 'react';
import { vi } from 'vitest';

import CosmicCursor from '@/components/CosmicCursor/CosmicCursor';
import { COARSE_POINTER_QUERY } from '@/components/CosmicCursor/useCosmicCursor';

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

HTMLCanvasElement.prototype.getContext = vi.fn(
  () => mockCtx
) as unknown as typeof HTMLCanvasElement.prototype.getContext;

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

  it('does not start animation loop when getContext returns null', () => {
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => null
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
    render(<CosmicCursor />);
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    // Restore mock for subsequent tests
    HTMLCanvasElement.prototype.getContext = vi.fn(
      () => mockCtx
    ) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  });

  it('returns null and renders no canvas without a fine pointer', async () => {
    // Override matchMedia to report a touch device
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === COARSE_POINTER_QUERY,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { container } = render(<CosmicCursor />);
    // After mount the state update fires; the canvas should be removed
    await act(async () => {});
    expect(container.querySelector('canvas')).toBeNull();

    // Restore matchMedia for subsequent tests
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

  it('injects a cursor style tag on mount and removes it on unmount', () => {
    const { unmount } = render(<CosmicCursor />);
    const styleEl = document.head.querySelector('style[data-cosmic-cursor]');
    expect(styleEl).not.toBeNull();
    expect(styleEl?.textContent).toContain('cursor: none');
    expect(styleEl?.textContent).toContain('cursor: text');
    unmount();
    expect(document.head.querySelector('style[data-cosmic-cursor]')).toBeNull();
  });

  it('gives clickable form controls the native pointer/grab cursor instead of the text caret', () => {
    render(<CosmicCursor />);
    const styleEl = document.head.querySelector('style[data-cosmic-cursor]');
    expect(styleEl?.textContent).toContain('cursor: pointer');
    expect(styleEl?.textContent).toMatch(/type="checkbox"/);
    expect(styleEl?.textContent).toMatch(/role="slider"/);
    expect(styleEl?.textContent).toContain('cursor: grabbing');
  });

  it('removes the resize event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<CosmicCursor />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });
});

// ─── Render loop ─────────────────────────────────────────────────────────────

describe('CosmicCursor render loop', () => {
  let capturedFrame: FrameRequestCallback | null = null;

  beforeEach(() => {
    capturedFrame = null;
    vi.clearAllMocks();
    // Override global RAF so tests can drive individual frames without recursion
    vi.mocked(requestAnimationFrame).mockImplementation((cb) => {
      capturedFrame = cb;
      return 1;
    });
  });

  afterEach(() => {
    // Restore to simple no-call implementation for other test suites
    vi.mocked(requestAnimationFrame).mockImplementation(() => 1);
    capturedFrame = null;
    // Clean up any injected style tags
    document.head.querySelector('style[data-cosmic-cursor]')?.remove();
  });

  it('fades the trail from the ink of the surface under the pointer, dark islands included', () => {
    const fills: string[] = [];
    Object.defineProperty(mockCtx, 'fillStyle', {
      configurable: true,
      get: () => '',
      set: (value: string) => fills.push(String(value)),
    });
    const island = document.createElement('section');
    island.dataset.theme = 'dark';
    island.innerHTML = '<p>Dark island</p>';
    document.body.append(island);
    const moveOver = (target: Element) => {
      fills.length = 0;
      for (let x = 100; x < 200; x += 10) {
        act(() => {
          target.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: 100, bubbles: true }));
        });
        act(() => {
          capturedFrame!(performance.now() + 16);
        });
      }
    };
    const CREAM = 'rgba(255,248,231,0)';
    const INK = 'rgba(2,6,23,0)';

    render(<CosmicCursor />);

    document.documentElement.dataset.theme = 'dark';
    moveOver(document.body);
    expect(fills).toContain(CREAM);

    document.documentElement.dataset.theme = 'light';
    moveOver(document.body);
    expect(fills).toContain(INK);
    expect(fills).not.toContain(CREAM);

    moveOver(island.querySelector('p')!);
    expect(fills).toContain(CREAM);
    expect(fills).not.toContain(INK);

    island.remove();
    delete document.documentElement.dataset.theme;
    Object.defineProperty(mockCtx, 'fillStyle', { configurable: true, writable: true, value: '' });
  });

  it('turns the core space blue over an orange-filled button only', () => {
    const fills: string[] = [];
    Object.defineProperty(mockCtx, 'fillStyle', {
      configurable: true,
      get: () => '',
      set: (value: string) => fills.push(String(value)),
    });
    const orange = document.createElement('button');
    orange.className = 'bg-aerospace hover:bg-aerospace/90';
    const plain = document.createElement('button');
    plain.className = 'hover:bg-aerospace';
    document.body.append(orange, plain);
    const moveOver = (target: Element) => {
      fills.length = 0;
      act(() => {
        target.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true }));
      });
      act(() => {
        capturedFrame!(performance.now() + 16);
      });
    };

    render(<CosmicCursor />);

    moveOver(orange);
    expect(fills).toContain('rgb(30,41,82)');

    moveOver(plain);
    expect(fills).toContain('rgb(255,79,0)');
    expect(fills).not.toContain('rgb(30,41,82)');

    orange.remove();
    plain.remove();
    Object.defineProperty(mockCtx, 'fillStyle', { configurable: true, writable: true, value: '' });
  });

  it('calls clearRect on each animation frame', () => {
    render(<CosmicCursor />);
    expect(capturedFrame).not.toBeNull();
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.clearRect).toHaveBeenCalled();
  });

  it('draws the core arc when the cursor is visible', () => {
    render(<CosmicCursor />);
    // Make cursor visible by firing a mousemove event
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true }));
    });
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.arc).toHaveBeenCalled();
  });

  it('skips the render body when dt exceeds 100ms (tab backgrounded)', () => {
    render(<CosmicCursor />);
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, bubbles: true }));
    });
    // Drive a frame with a dt > 100ms — should re-schedule without drawing
    act(() => {
      capturedFrame!(performance.now() + 150);
    });
    expect(mockCtx.clearRect).not.toHaveBeenCalled();
    // A new frame should have been scheduled
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2); // initial + retry
  });

  it('tracks position across consecutive mousemove events', () => {
    render(<CosmicCursor />);
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true }));
    });
    // Drive a frame to confirm the draw proceeds with updated state
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.clearRect).toHaveBeenCalled();
  });

  it('hides the cursor on mouseleave', () => {
    render(<CosmicCursor />);
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
    // After mouseleave the canvas should be cleared (cursor hidden)
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.clearRect).toHaveBeenCalled();
    // arc should NOT have been called (cursor not visible)
    expect(mockCtx.arc).not.toHaveBeenCalled();
  });

  it('makes cursor visible again on mouseenter', () => {
    render(<CosmicCursor />);
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    });
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true }));
    });
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.arc).toHaveBeenCalled();
  });

  it('does not snap the cursor toward the center of a wide link', () => {
    // A full-row link far wider than the magnetic range — its center sits well away
    // from where the pointer actually hovers (e.g. the trailing arrow icon).
    const link = document.createElement('a');
    document.body.appendChild(link);

    vi.spyOn(link, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      top: 400,
      width: 1200,
      height: 80,
      right: 1200,
      bottom: 480,
      x: 0,
      y: 400,
      toJSON: () => ({}),
    } as DOMRect);

    const coreRadius = 3; // the 6 px core dot — trail dots stay below this radius, the ring and glow above
    render(<CosmicCursor />);

    const pointerX = 1150;
    const pointerY = 440;

    act(() => {
      link.dispatchEvent(new MouseEvent('mousemove', { clientX: pointerX, clientY: pointerY, bubbles: true }));
    });
    // Drive several frames so the smoothed position converges
    for (let i = 0; i < 25; i++) {
      act(() => {
        capturedFrame!(performance.now() + 16);
      });
    }

    const coreCalls = mockCtx.arc.mock.calls.filter((call) => call[2] === coreRadius);
    expect(coreCalls.length).toBeGreaterThan(0);
    const [lastX, lastY] = coreCalls[coreCalls.length - 1] as [number, number, number];
    expect(lastX).toBeGreaterThan(pointerX - 5);
    expect(lastY).toBeGreaterThan(pointerY - 5);

    document.body.removeChild(link);
  });
});
