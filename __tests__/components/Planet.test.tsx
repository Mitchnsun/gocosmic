import { vi } from 'vitest';

import Planet from '@/components/Planet';
import { usePlanetAnimation } from '@/components/Planet/usePlanetAnimation';

import { act, fireEvent, render } from '../test-utils';

const RefLessPlanet = () => {
  usePlanetAnimation({ parallaxMode: 'gyro' });

  return <div />;
};

describe('Planet', () => {
  let frameCallbacks: Map<number, FrameRequestCallback>;
  let nextFrame: number;

  const setupAnimationFrameMock = (startFrame = 1) => {
    nextFrame = startFrame;
    frameCallbacks = new Map();
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        const frame = nextFrame++;
        frameCallbacks.set(frame, callback);
        return frame;
      })
    );
  };

  const runAnimationFrames = (count: number) => {
    for (let index = 0; index < count; index++) {
      const nextFrame = frameCallbacks.entries().next().value;
      if (!nextFrame) return;

      const [frame, callback] = nextFrame;
      frameCallbacks.delete(frame);
      callback(performance.now());
    }
  };

  beforeEach(() => {
    setupAnimationFrameMock();
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete (window as Window & { ontouchstart?: unknown }).ontouchstart;
  });

  it('should render a hidden responsive planet with parallax variables', () => {
    const { container } = render(<Planet size={240} parallaxMode="pointer" />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveClass('will-change-transform');
    expect(wrapper).toHaveStyle({ width: '240px', height: '240px' });
    expect(wrapper.style.transform).toContain('--planet-scroll-y');
    expect(container.querySelector('.planet-body-surface')).toHaveClass('will-change-transform');
    expect(container.querySelectorAll('.planet-surface-spot')).toHaveLength(2);
  });

  it('should reveal the planet with requestAnimationFrame and spin it in CSS', () => {
    const { container } = render(<Planet size={240} parallaxMode="pointer" />);
    const wrapper = container.firstElementChild as HTMLElement;
    const body = container.querySelector<HTMLElement>('.planet-body-surface')!;

    expect(wrapper.style.opacity).toBe('0');
    expect(wrapper.style.getPropertyValue('--planet-reveal-scale')).toBe('0.72');
    expect(body).toHaveClass('animate-planet-spin');

    runAnimationFrames(1);

    expect(wrapper.style.opacity).toBe('1');
    expect(wrapper.style.getPropertyValue('--planet-reveal-scale')).toBe('1');
    expect(body.style.transform).toBe('');
    expect(frameCallbacks.size).toBe(0);

    fireEvent.transitionEnd(wrapper);

    expect(wrapper.style.opacity).toBe('');
    expect(wrapper.style.getPropertyValue('--planet-reveal-scale')).toBe('');
    expect(wrapper.style.transition).toBe('');
  });

  it('should keep the tilt loop stopped while the planet is off screen', () => {
    let reportVisibility: (isIntersecting: boolean) => void = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback) {
          reportVisibility = (isIntersecting) =>
            callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
        }
        observe() {
          reportVisibility(false);
        }
        disconnect = disconnect;
      }
    );

    const { unmount } = render(<Planet size={240} parallaxMode="gyro" />);
    // Only the reveal frame is queued: a hidden planet (e.g. the phone one on a desktop) never ticks.
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    act(() => reportVisibility(true));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(2);

    act(() => reportVisibility(false));
    expect(cancelAnimationFrame).toHaveBeenCalledWith(2);

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('should not spin when reduced motion is enabled', () => {
    const { container } = render(<Planet size={240} reducedMotion />);

    expect(container.querySelector('.planet-body-surface')).not.toHaveClass('animate-planet-spin');
  });

  it('should attach and clean up gyro and scroll listeners', () => {
    const addListener = vi.spyOn(window, 'addEventListener');
    const removeListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<Planet size={240} parallaxMode="gyro" />);

    expect(addListener).toHaveBeenCalledWith('deviceorientation', expect.any(Function));
    expect(addListener).toHaveBeenCalledWith('scroll', expect.any(Function), { passive: true });

    unmount();

    expect(removeListener).toHaveBeenCalledWith('deviceorientation', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should lerp gyroscope orientation into tilt variables', () => {
    const { container } = render(<Planet size={240} parallaxMode="gyro" />);
    const wrapper = container.firstElementChild as HTMLElement;
    const event = new Event('deviceorientation') as DeviceOrientationEvent;

    Object.defineProperties(event, {
      beta: { value: 90 },
      gamma: { value: 90 },
    });

    window.dispatchEvent(event);
    runAnimationFrames(3);

    expect(Number.parseFloat(wrapper.style.getPropertyValue('--planet-tilt-x'))).toBeGreaterThan(0);
    expect(Number.parseFloat(wrapper.style.getPropertyValue('--planet-tilt-y'))).toBeGreaterThan(0);
  });

  it('should auto-select gyroscope mode on touch devices', () => {
    Object.defineProperty(window, 'ontouchstart', { configurable: true, value: null });
    const addListener = vi.spyOn(window, 'addEventListener');

    render(<Planet size={240} parallaxMode="auto" />);

    expect(addListener).toHaveBeenCalledWith('deviceorientation', expect.any(Function));
  });

  it('should tolerate missing animation refs', () => {
    const addListener = vi.spyOn(window, 'addEventListener');

    render(<RefLessPlanet />);

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(addListener).not.toHaveBeenCalledWith('deviceorientation', expect.any(Function));
  });

  it('should handle empty orientation values and skip fallback after gyro input', () => {
    vi.useFakeTimers();
    setupAnimationFrameMock(200);
    const { container } = render(<Planet size={240} parallaxMode="gyro" />);
    const wrapper = container.firstElementChild as HTMLElement;
    const event = new Event('deviceorientation') as DeviceOrientationEvent;

    Object.defineProperties(event, {
      beta: { value: null },
      gamma: { value: null },
    });

    window.dispatchEvent(event);

    act(() => {
      vi.advanceTimersByTime(1500);
      runAnimationFrames(8);
    });

    expect(Number.parseFloat(wrapper.style.getPropertyValue('--planet-tilt-x'))).toBe(0);
    expect(Number.parseFloat(wrapper.style.getPropertyValue('--planet-tilt-y'))).toBeLessThan(0);
  });

  it('should use auto-float fallback when gyroscope is unavailable', () => {
    vi.useFakeTimers();
    setupAnimationFrameMock(100);
    const { container } = render(<Planet size={240} parallaxMode="gyro" />);
    const wrapper = container.firstElementChild as HTMLElement;

    act(() => {
      vi.advanceTimersByTime(1500);
      runAnimationFrames(8);
    });

    expect(Number.parseFloat(wrapper.style.getPropertyValue('--planet-tilt-x'))).not.toBe(0);
    expect(Number.parseFloat(wrapper.style.getPropertyValue('--planet-tilt-y'))).not.toBe(0);
  });

  it('should skip animation effects when reduced motion is enabled', () => {
    const addListener = vi.spyOn(window, 'addEventListener');

    render(<Planet size={240} parallaxMode="gyro" reducedMotion />);

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(addListener).not.toHaveBeenCalledWith('deviceorientation', expect.any(Function));
    expect(addListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  });
});
