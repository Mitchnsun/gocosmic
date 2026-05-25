import { vi } from 'vitest';

import Planet from '@/components/Planet';

import { render } from '../test-utils';

describe('Planet', () => {
  beforeEach(() => {
    let nextFrame = 1;
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => nextFrame++)
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render a hidden responsive planet with hero parallax variables', () => {
    const { container } = render(<Planet size={240} parallaxMode="pointer" useHeroParallax />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveClass('will-change-transform');
    expect(wrapper).toHaveStyle({ width: '240px', height: '240px' });
    expect(wrapper.style.transform).toContain('--hero-parallax-x');
    expect(wrapper.style.transform).toContain('--planet-scroll-y');
    expect(container.querySelector('.planet-body-surface')).toHaveClass('will-change-transform');
    expect(container.querySelectorAll('.planet-surface-spot')).toHaveLength(2);
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

  it('should skip animation effects when reduced motion is enabled', () => {
    const addListener = vi.spyOn(window, 'addEventListener');

    render(<Planet size={240} parallaxMode="gyro" reducedMotion />);

    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(addListener).not.toHaveBeenCalledWith('deviceorientation', expect.any(Function));
    expect(addListener).not.toHaveBeenCalledWith('scroll', expect.any(Function), expect.anything());
  });
});
