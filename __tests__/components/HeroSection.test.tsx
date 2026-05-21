import { vi } from 'vitest';

import HeroSection from '@/components/HeroSection';

import { render, screen } from '../test-utils';

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

describe('HeroSection', () => {
  beforeEach(() => {
    starfieldMock.mockClear();
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

  it('should respect prefers-reduced-motion', () => {
    window.matchMedia = vi.fn().mockReturnValue({
      addEventListener: vi.fn(),
      matches: true,
      removeEventListener: vi.fn(),
    });

    const { container } = renderHero();

    expect(container.querySelector('section')).toHaveAttribute('data-reduced-motion', 'true');
  });
});
