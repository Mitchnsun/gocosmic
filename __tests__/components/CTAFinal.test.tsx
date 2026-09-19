import { vi } from 'vitest';

import CTAFinal from '@/components/CTAFinal';

import { fireEvent, render } from '../test-utils';

const { starfieldMock } = vi.hoisted(() => ({
  starfieldMock: vi.fn(
    ({
      className,
      speed,
      starCount,
      respectReducedMotion,
    }: {
      className?: string;
      speed?: number;
      starCount?: number;
      respectReducedMotion?: boolean;
    }) => (
      <canvas
        aria-hidden="true"
        className={className}
        data-speed={speed}
        data-star-count={starCount}
        data-respect-reduced-motion={respectReducedMotion ? 'true' : 'false'}
      />
    )
  ),
}));

vi.mock('@/components/Starfield', () => ({
  default: starfieldMock,
}));

const renderCTA = (props = {}) =>
  render(
    <CTAFinal
      headline="Ready to Go Cosmic?"
      description="Let's discuss how we can bring your vision to life."
      ctaText="Contact us"
      ctaHref="/contact"
      {...props}
    />
  );

const lastStarfieldProps = () =>
  starfieldMock.mock.calls.at(-1)?.[0] as { speed: number; starCount: number; respectReducedMotion: boolean };

describe('CTAFinal', () => {
  beforeEach(() => {
    starfieldMock.mockClear();
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    });
  });

  it('should render headline, description and CTA button', () => {
    const { getByRole, getByText } = renderCTA();

    expect(getByRole('heading', { level: 2 })).toHaveTextContent('Ready to Go Cosmic?');
    expect(getByText("Let's discuss how we can bring your vision to life.")).toBeInTheDocument();
    expect(getByRole('link', { name: /Contact us/ })).toHaveAttribute('href', '/contact');
  });

  it('should render the optional note with a link when provided', () => {
    const { getByRole } = renderCTA({
      note: (
        <>
          Not ready to talk yet? Ask for your <a href="/free-mockup">free mockup</a>.
        </>
      ),
    });

    expect(getByRole('link', { name: 'free mockup' })).toHaveAttribute('href', '/free-mockup');
  });

  it('should not render a note when none is provided', () => {
    const { queryByText } = renderCTA();

    expect(queryByText(/free mockup/i)).not.toBeInTheDocument();
  });

  it('should render the starfield background', () => {
    const { container } = renderCTA();

    expect(container.querySelector('canvas')).toHaveAttribute('aria-hidden', 'true');
    expect(starfieldMock).toHaveBeenCalled();
  });

  it('should map density presets to star counts', () => {
    renderCTA({ starfieldDensity: 'low' });
    expect(lastStarfieldProps().starCount).toBe(250);

    renderCTA({ starfieldDensity: 'medium' });
    expect(lastStarfieldProps().starCount).toBe(400);

    renderCTA({ starfieldDensity: 'high' });
    expect(lastStarfieldProps().starCount).toBe(600);
  });

  it('should scale the rest speed from the starfieldSpeed prop', () => {
    renderCTA({ starfieldSpeed: 0.2 });
    expect(lastStarfieldProps().speed).toBe(2);
  });

  it('should warp the starfield on CTA hover and reset on leave', () => {
    const { getByRole } = renderCTA({ starfieldDensity: 'high', starfieldSpeed: 0.2, starfieldWarpSpeed: 0.8 });
    const cta = getByRole('link', { name: /Contact us/ });

    fireEvent.pointerEnter(cta);
    expect(lastStarfieldProps().speed).toBe(8);
    expect(lastStarfieldProps().starCount).toBe(780);

    fireEvent.pointerLeave(cta);
    expect(lastStarfieldProps().speed).toBe(2);
    expect(lastStarfieldProps().starCount).toBe(600);
  });

  it('should warp the starfield on CTA focus and reset on blur', () => {
    const { getByRole } = renderCTA();
    const cta = getByRole('link', { name: /Contact us/ });

    fireEvent.focus(cta);
    expect(lastStarfieldProps().speed).toBe(8);

    fireEvent.blur(cta);
    expect(lastStarfieldProps().speed).toBe(2);
  });

  it('should not warp when warpOnHover is disabled', () => {
    const { getByRole } = renderCTA({ warpOnHover: false });
    const cta = getByRole('link', { name: /Contact us/ });

    fireEvent.pointerEnter(cta);
    expect(lastStarfieldProps().speed).toBe(2);
  });

  it('should disable warp and motion classes when prefers-reduced-motion is set', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: true,
      removeEventListener: vi.fn(),
    });

    const { container, getByRole } = renderCTA();
    const section = container.querySelector('section');
    const cta = getByRole('link', { name: /Contact us/ });

    expect(section).toHaveAttribute('data-reduced-motion', 'true');

    fireEvent.pointerEnter(cta);
    expect(lastStarfieldProps().speed).toBe(2);
    // The starfield freezes itself: it draws one frame and starts no loop.
    expect(lastStarfieldProps().respectReducedMotion).toBe(true);
  });

  describe.each([
    ['immersive', 'hover:scale-[1.08]', 'focus-visible:scale-[1.08]'],
    ['sober', 'hover:scale-[1.03]', 'focus-visible:scale-[1.03]'],
  ] as const)('%s tone CTA motion', (tone, hoverScale, focusScale) => {
    const mockReducedMotion = (matches: boolean) => {
      window.matchMedia = vi.fn().mockReturnValue({
        addEventListener: vi.fn(),
        matches,
        removeEventListener: vi.fn(),
      });
    };

    it('should scale the CTA on hover and focus by default', () => {
      const { getByRole } = renderCTA({ tone });
      const cta = getByRole('link', { name: /Contact us/ });

      expect(cta).toHaveClass(hoverScale, focusScale, 'transition-transform');
    });

    it('should drop the CTA scale and transition when prefers-reduced-motion is set', () => {
      mockReducedMotion(true);
      const { getByRole } = renderCTA({ tone });
      const cta = getByRole('link', { name: /Contact us/ });

      expect(cta).not.toHaveClass(hoverScale);
      expect(cta).not.toHaveClass(focusScale);
      expect(cta).not.toHaveClass('transition-transform');
      expect(cta).toHaveClass('motion-reduce:scale-100!', 'motion-reduce:transition-none!');
    });

    it('should keep the CTA scale when the preference is not honoured', () => {
      mockReducedMotion(true);
      const { getByRole } = renderCTA({ tone, respectReducedMotion: false });
      const cta = getByRole('link', { name: /Contact us/ });

      expect(cta).toHaveClass(hoverScale, focusScale, 'transition-transform');
      expect(cta).not.toHaveClass('motion-reduce:scale-100!');
    });
  });

  it('should leave the starfield animating when the preference is not honoured', () => {
    renderCTA({ respectReducedMotion: false });

    expect(lastStarfieldProps().respectReducedMotion).toBe(false);
  });

  it('should call onCtaClick when the button is clicked', () => {
    const onCtaClick = vi.fn();
    const { getByRole } = renderCTA({ onCtaClick });

    fireEvent.click(getByRole('link', { name: /Contact us/ }));
    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it('should apply the accent variant to the CTA button and headline gradient', () => {
    const { getByRole, getByText } = renderCTA({ accentColor: 'jungle' });

    const cta = getByRole('link', { name: /Contact us/ });
    expect(cta).toHaveClass('bg-jungle', 'cta-final-glow');

    const headline = getByText('Ready to Go Cosmic?');
    expect(headline).toHaveClass('cta-final-headline', 'from-jungle');
  });

  it('should expose the accent colour as a CSS variable', () => {
    const { container } = renderCTA({ accentColor: 'royal' });
    expect(container.querySelector('section')).toHaveStyle({ '--cta-accent-rgb': '120 81 169' });
  });

  it('should apply a custom className and id to the section', () => {
    const { container } = renderCTA({ className: 'custom-class', id: 'final-cta' });
    const section = container.querySelector('section');

    expect(section).toHaveClass('custom-class');
    expect(section).toHaveAttribute('id', 'final-cta');
  });
  describe('sober tone', () => {
    it('should default to the immersive tone', () => {
      const { container } = renderCTA();

      expect(container.querySelector('section')).toHaveAttribute('data-tone', 'immersive');
      expect(container.querySelector('.cta-final-headline')).toBeInTheDocument();
      expect(container.querySelector('.cta-final-glow')).toBeInTheDocument();
    });

    it('should use a light starfield by default', () => {
      const { container } = renderCTA({ tone: 'sober' });

      expect(container.querySelector('section')).toHaveAttribute('data-tone', 'sober');
      expect(lastStarfieldProps().starCount).toBe(250);
    });

    it('should drop the animated headline, button glow and accent halo', () => {
      const { container } = renderCTA({ tone: 'sober' });

      expect(container.querySelector('.cta-final-headline')).not.toBeInTheDocument();
      expect(container.querySelector('.cta-final-glow')).not.toBeInTheDocument();
      expect(container.querySelector('[style*="radial-gradient"]')).not.toBeInTheDocument();
    });

    it('should not warp the starfield on hover or focus', () => {
      const { getByRole } = renderCTA({ tone: 'sober' });
      const cta = getByRole('link', { name: /Contact us/ });
      const restSpeed = lastStarfieldProps().speed;

      fireEvent.pointerEnter(cta);
      expect(lastStarfieldProps().speed).toBe(restSpeed);
      fireEvent.focus(cta);
      expect(lastStarfieldProps().speed).toBe(restSpeed);
    });

    it('should let explicit props override the tone defaults', () => {
      const { getByRole } = renderCTA({ tone: 'sober', starfieldDensity: 'high', warpOnHover: true });

      expect(lastStarfieldProps().starCount).toBe(600);
      fireEvent.pointerEnter(getByRole('link', { name: /Contact us/ }));
      expect(lastStarfieldProps().starCount).toBe(780);
    });
  });
});
