import { vi } from 'vitest';

import HeroSection from '@/components/HeroSection';

import { fireEvent, render, screen } from '../test-utils';

const { starfieldMock } = vi.hoisted(() => ({
  starfieldMock: vi.fn(
    ({ className, speed, starCount }: { className?: string; speed?: number; starCount?: number }) => (
      <canvas aria-hidden="true" className={className} data-speed={speed} data-star-count={starCount} />
    )
  ),
}));

vi.mock('@/components/Starfield', () => ({
  default: starfieldMock,
}));

const renderHero = (props = {}) =>
  render(
    <HeroSection
      title="We build stellar applications that"
      endWord="shine"
      subtitle="Test subtitle"
      ctaText="Start your journey"
      ctaHref="/journey"
      {...props}
    />
  );

const dispatchPointerMove = (element: Element, clientX: number, clientY: number) => {
  const event = new Event('pointermove', { bubbles: true });
  Object.defineProperties(event, {
    clientX: { value: clientX },
    clientY: { value: clientY },
  });
  fireEvent(element, event);
};

describe('HeroSection', () => {
  beforeEach(() => {
    starfieldMock.mockClear();
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      })
    );
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    });
  });

  it('should render headline with title and endWord', () => {
    renderHero();

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('We build stellar applications that shine');
    expect(screen.getByText('shine')).toBeInTheDocument();
  });

  it('should render subtitle and CTA button', () => {
    renderHero();

    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Start your journey/ })).toHaveAttribute('href', '/journey');
  });

  it('should apply accent color class to endWord', () => {
    const { container } = renderHero({ accentColor: 'royal' });

    expect(container.querySelector('[data-end-word]')).toHaveClass('text-royal');
  });

  it('should render Starfield component with correct props', () => {
    renderHero({ starfieldDensity: 'high', starfieldSpeed: 0.4 });

    expect(starfieldMock).toHaveBeenCalledWith(
      expect.objectContaining({
        speed: 2,
        starCount: 520,
      }),
      undefined
    );
  });

  it('should apply alternate accent, density, speed, id, className, and compact variant props', () => {
    const { container } = renderHero({
      accentColor: 'jungle',
      className: 'custom-hero',
      id: 'hero',
      starfieldDensity: 'low',
      starfieldSpeed: 2,
      variant: 'compact',
    });

    expect(container.querySelector('section')).toHaveAttribute('id', 'hero');
    expect(container.querySelector('section')).toHaveClass('custom-hero', 'py-8');
    expect(container.querySelector('[data-end-word]')).toHaveClass('text-jungle');
    expect(starfieldMock).toHaveBeenCalledWith(
      expect.objectContaining({
        speed: 5,
        starCount: 180,
      }),
      undefined
    );
  });

  it('should support medium starfield density and royal accent styling', () => {
    const { container } = renderHero({ accentColor: 'royal', starfieldDensity: 'medium' });

    expect(container.querySelector('[data-end-word]')).toHaveClass('text-royal');
    expect(starfieldMock).toHaveBeenCalledWith(expect.objectContaining({ starCount: 340 }), undefined);
  });

  it('should respect prefers-reduced-motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: true,
      removeEventListener: vi.fn(),
    });

    const { container } = renderHero();

    expect(container.querySelector('section')).toHaveAttribute('data-reduced-motion', 'true');
  });

  it('should allow motion when reduced-motion handling is disabled', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: true,
      removeEventListener: vi.fn(),
    });

    const { container } = renderHero({ respectReducedMotion: false });

    expect(container.querySelector('section')).toHaveAttribute('data-reduced-motion', 'false');
  });

  it('should update scroll parallax variables', () => {
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 800 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 400 });

    const { container } = renderHero();
    const section = container.querySelector('section');

    expect(section).toHaveStyle({ '--hero-scroll-offset': '18px', '--hero-opacity': '0.72' });
  });

  it('should update pointer parallax variables', () => {
    const { container } = renderHero();
    const section = container.querySelector('section');
    section!.getBoundingClientRect = vi.fn(() => ({
      bottom: 200,
      height: 200,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }));

    dispatchPointerMove(section!, 200, 200);

    expect(section).toHaveStyle({ '--hero-parallax-x': '7px', '--hero-parallax-y': '4.5px' });
  });

  it('should move and reset the magnetic CTA', () => {
    renderHero();
    const ctaWrapper = screen.getByRole('link', { name: /Start your journey/ }).parentElement;
    ctaWrapper!.getBoundingClientRect = vi.fn(() => ({
      bottom: 100,
      height: 100,
      left: 0,
      right: 200,
      top: 0,
      width: 200,
      x: 0,
      y: 0,
      toJSON: vi.fn(),
    }));

    dispatchPointerMove(ctaWrapper!, 200, 100);
    expect(ctaWrapper).toHaveStyle({ '--hero-cta-x': '18px', '--hero-cta-y': '9px' });

    fireEvent.pointerLeave(ctaWrapper!);
    expect(ctaWrapper).toHaveStyle({ '--hero-cta-x': '0px', '--hero-cta-y': '0px' });
  });

  it('should cancel a pending parallax frame on unmount', () => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 42)
    );
    const { container, unmount } = renderHero();
    const section = container.querySelector('section');
    section!.getBoundingClientRect = vi.fn();

    dispatchPointerMove(section!, 200, 200);
    unmount();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
  });
});
