import { vi } from 'vitest';

import Starfield from '@/components/Starfield';

import { render } from '../test-utils';

// Mock canvas context methods used by the Starfield animation
const mockCtx = {
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
};

// Mock getContext on HTMLCanvasElement
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype as any).getContext = vi.fn(() => mockCtx);

// Stub requestAnimationFrame so the animation loop doesn't run indefinitely
vi.stubGlobal(
  'requestAnimationFrame',
  vi.fn(() => 1)
);
vi.stubGlobal('cancelAnimationFrame', vi.fn());

describe('Starfield Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render a canvas element', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeNull();
  });

  it('should set aria-hidden on the canvas element', () => {
    const { container } = render(<Starfield />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('aria-hidden', 'true');
  });

  it('should apply a custom className to the canvas element', () => {
    const { container } = render(<Starfield className="absolute inset-0" />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('absolute', 'inset-0');
  });

  it('should request a canvas 2d context on mount', () => {
    render(<Starfield />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('should start the animation loop via requestAnimationFrame', () => {
    render(<Starfield />);
    expect(requestAnimationFrame).toHaveBeenCalled();
  });

  it('should draw the background rect on each frame', () => {
    render(<Starfield />);
    expect(mockCtx.fillRect).toHaveBeenCalled();
  });

  it('should cancel the animation frame on unmount', () => {
    const { unmount } = render(<Starfield />);
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it('should remove the resize event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Starfield />);
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should use default starCount and speed when no props are provided', () => {
    // Render without props — should not throw
    expect(() => render(<Starfield />)).not.toThrow();
  });

  it('should accept custom starCount and speed props', () => {
    expect(() => render(<Starfield starCount={50} speed={5} />)).not.toThrow();
  });

  it('should keep one animation instance when speed and starCount props change', () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const { rerender, unmount } = render(<Starfield starCount={50} speed={2} />);

    rerender(<Starfield starCount={90} speed={8} />);

    expect(addSpy).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).not.toHaveBeenCalled();

    unmount();
  });

  describe('reduced motion', () => {
    const stubMatchMedia = (matches: boolean) => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
          matches,
          media: query,
          onchange: null,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        }),
      });
    };

    it('draws a single static frame and starts no loop when the visitor prefers reduced motion', () => {
      stubMatchMedia(true);

      render(<Starfield starCount={20} speed={4} respectReducedMotion />);

      expect(mockCtx.fillRect).toHaveBeenCalled();
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    it('keeps animating when the component does not opt in', () => {
      stubMatchMedia(true);

      render(<Starfield starCount={20} speed={4} />);

      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    it('animates for a visitor with no reduced-motion preference', () => {
      stubMatchMedia(false);

      render(<Starfield starCount={20} speed={4} respectReducedMotion />);

      expect(requestAnimationFrame).toHaveBeenCalled();
    });
  });
});
