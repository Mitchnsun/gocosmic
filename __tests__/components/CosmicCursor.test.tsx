import { renderHook } from '@testing-library/react';
import { act } from 'react';
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

  it('returns null and renders no canvas on touch devices', async () => {
    // Override matchMedia to report a touch device
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(hover: none) and (pointer: coarse)',
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
    unmount();
    expect(document.head.querySelector('style[data-cosmic-cursor]')).toBeNull();
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

  it('calculates velocity on the second mousemove event', () => {
    render(<CosmicCursor />);
    // First event sets lastTime (velocity skipped)
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 100, bubbles: true }));
    });
    // Second event calculates velocity from the delta
    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true }));
    });
    // Drive a frame to confirm the draw proceeds with updated state
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.clearRect).toHaveBeenCalled();
  });

  it('hides the cursor and resets velocity on mouseleave', () => {
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

  it('applies magnetic snap when a [data-magnetic] element is within range', () => {
    // Place a magnetic element somewhere in the document
    const btn = document.createElement('button');
    btn.setAttribute('data-magnetic', '');
    btn.setAttribute('data-accent', 'royal');
    document.body.appendChild(btn);

    // Mock getBoundingClientRect so jsdom returns a usable rect
    vi.spyOn(btn, 'getBoundingClientRect').mockReturnValue({
      left: 50,
      top: 50,
      width: 100,
      height: 40,
      right: 150,
      bottom: 90,
      x: 50,
      y: 50,
      toJSON: () => ({}),
    } as DOMRect);

    render(<CosmicCursor magneticRange={200} />);

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 90, clientY: 70, bubbles: true }));
    });
    act(() => {
      capturedFrame!(performance.now() + 16);
    });
    expect(mockCtx.arc).toHaveBeenCalled();

    document.body.removeChild(btn);
  });

  it('does not snap the cursor toward the center of a wide link', () => {
    // A full-row link far wider than the magnetic range — its center sits well away
    // from where the pointer actually hovers (e.g. the trailing arrow icon).
    const link = document.createElement('a');
    link.setAttribute('data-magnetic', '');
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

    const coreSize = 20; // radius 10 — distinct from trail/orbit dot radii so it's identifiable
    render(<CosmicCursor coreSize={coreSize} />);

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

    const coreCalls = mockCtx.arc.mock.calls.filter((call) => call[2] === coreSize / 2);
    expect(coreCalls.length).toBeGreaterThan(0);
    const [lastX, lastY] = coreCalls[coreCalls.length - 1] as [number, number, number];
    expect(lastX).toBeGreaterThan(pointerX - 5);
    expect(lastY).toBeGreaterThan(pointerY - 5);

    document.body.removeChild(link);
  });
});

// ─── useMagneticElements ─────────────────────────────────────────────────────

describe('useMagneticElements', () => {
  it('returns a ref object', () => {
    const { result } = renderHook(() => useMagneticElements([{ selector: 'button', accent: 'aerospace' }]));
    expect(result.current).toHaveProperty('current');
  });

  it('adds data-magnetic and data-accent to matched elements in the document', () => {
    const btn = document.createElement('button');
    btn.className = 'magnetic-test';
    document.body.appendChild(btn);

    const { unmount } = renderHook(() => useMagneticElements([{ selector: 'button.magnetic-test', accent: 'royal' }]));

    expect(btn).toHaveAttribute('data-magnetic');
    expect(btn).toHaveAttribute('data-accent', 'royal');

    unmount();

    expect(btn).not.toHaveAttribute('data-magnetic');
    expect(btn).not.toHaveAttribute('data-accent');

    document.body.removeChild(btn);
  });

  it('adds data-magnetic without data-accent when no accent is provided', () => {
    const link = document.createElement('a');
    link.className = 'magnetic-link-test';
    document.body.appendChild(link);

    const { unmount } = renderHook(() => useMagneticElements([{ selector: 'a.magnetic-link-test' }]));

    expect(link).toHaveAttribute('data-magnetic');
    expect(link).not.toHaveAttribute('data-accent');

    unmount();
    document.body.removeChild(link);
  });

  it('preserves pre-existing data-magnetic and restores data-accent on unmount', () => {
    const btn = document.createElement('button');
    btn.className = 'pre-existing-magnetic';
    btn.setAttribute('data-magnetic', '');
    btn.setAttribute('data-accent', 'royal');
    document.body.appendChild(btn);

    const { unmount } = renderHook(() =>
      useMagneticElements([{ selector: 'button.pre-existing-magnetic', accent: 'aerospace' }])
    );

    // The hook overwrites data-accent while active
    expect(btn).toHaveAttribute('data-accent', 'aerospace');

    unmount();

    // data-magnetic was there before — must still be there
    expect(btn).toHaveAttribute('data-magnetic');
    // data-accent must be restored to the original value
    expect(btn).toHaveAttribute('data-accent', 'royal');

    document.body.removeChild(btn);
  });
});
