import { act } from '@testing-library/react';
import { vi } from 'vitest';

import HeroSection from '@/components/HeroSection';
import { THEME_STORAGE_KEY, ThemeProvider } from '@/components/Theme';

import { render, screen } from '../test-utils';

const { planetMock, starfieldMock } = vi.hoisted(() => ({
  planetMock: vi.fn((props: Record<string, unknown>) => <div data-size={String(props.size)} data-testid="planet" />),
  starfieldMock: vi.fn(({ className }: { className?: string }) => <canvas aria-hidden="true" className={className} />),
}));

vi.mock('@/components/Starfield', () => ({ default: starfieldMock }));
vi.mock('@/components/Planet', () => ({ default: planetMock }));

const mockReducedMotion = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    matches,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  });
};

const renderHero = (props = {}) =>
  render(
    <HeroSection
      eyebrow="Web & mobile studio · Geneva"
      title="Your business deserves to be"
      endWords={['seen.', 'found.', 'chosen.']}
      subtitle="Test subtitle"
      cta={{ text: 'Go Cosmic', href: '/free-mockup' }}
      secondaryCta={{ text: 'See pricing', href: '/services' }}
      facts={[
        { highlight: 'From 10€', text: '/ month' },
        { highlight: 'Fast', text: 'reply' },
      ]}
      {...props}
    />
  );

describe('HeroSection', () => {
  beforeEach(() => {
    starfieldMock.mockClear();
    planetMock.mockClear();
    mockReducedMotion(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the headline with the first end word in the italic emphasis', () => {
    renderHero();
    const heading = screen.getByRole('heading', { level: 1 });

    expect(heading).toHaveAccessibleName('Your business deserves to be seen.');
    expect(screen.getByText('seen.').closest('em')).toHaveClass('font-light');
  });

  it('renders the eyebrow, subtitle and both calls-to-action', () => {
    renderHero();

    expect(screen.getByText('Web & mobile studio · Geneva')).toBeInTheDocument();
    expect(screen.getByText('Test subtitle')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go Cosmic' })).toHaveAttribute('href', '/free-mockup');
    expect(screen.getByRole('link', { name: 'See pricing' })).toHaveAttribute('href', '/services');
  });

  it('renders the mono facts line', () => {
    renderHero();
    const facts = screen.getAllByRole('listitem');

    expect(facts).toHaveLength(2);
    expect(facts[0]).toHaveTextContent('From 10€ / month');
  });

  it('omits the secondary CTA and the facts line when not provided', () => {
    renderHero({ secondaryCta: undefined, facts: undefined });

    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('cycles through the end words', () => {
    vi.useFakeTimers();
    renderHero({ wordInterval: 1000 });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Your business deserves to be found.');
  });

  it('keeps the first word and flags reduced motion when the visitor asks for it', () => {
    mockReducedMotion(true);
    vi.useFakeTimers();
    const { container } = renderHero({ wordInterval: 1000 });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByRole('heading', { level: 1 })).toHaveAccessibleName('Your business deserves to be seen.');
    expect(container.querySelector('section')).toHaveAttribute('data-reduced-motion', 'true');
  });

  it('renders the starfield in the background, frozen under reduced motion', () => {
    renderHero();

    expect(starfieldMock).toHaveBeenCalled();
    expect(starfieldMock.mock.calls[0]?.[0]).toMatchObject({ respectReducedMotion: true });
  });

  it('renders desktop and mobile planets sharing the reduced-motion state', () => {
    renderHero();

    expect(screen.getAllByTestId('planet')).toHaveLength(2);
    expect(planetMock.mock.calls.map(([props]) => props)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ size: 480, parallaxMode: 'pointer', scrollFactor: 0.3, reducedMotion: false }),
        expect.objectContaining({
          size: 240,
          parallaxMode: 'gyro',
          gyroAmplitude: 15,
          scrollFactor: 0.3,
          reducedMotion: false,
        }),
      ])
    );
  });

  it('freezes the planets when the visitor prefers reduced motion', () => {
    mockReducedMotion(true);
    renderHero();

    expect(planetMock.mock.calls.every(([props]) => props.reducedMotion === true)).toBe(true);
  });

  describe('theme scenes', () => {
    afterEach(() => localStorage.clear());

    it('shows the stars and the planet in the dark theme, the sun only in CSS for the light one', () => {
      const { container } = renderHero();

      expect(starfieldMock).toHaveBeenCalled();
      expect(screen.getAllByTestId('planet')).toHaveLength(2);
      expect(container.querySelector('.sun-disc')?.parentElement).toHaveClass('hidden', 'light:block');
      expect(container.querySelector('canvas')?.parentElement).toHaveClass('light:hidden');
    });

    it('unmounts the stars and the planet in the light theme', () => {
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
      render(
        <ThemeProvider>
          <HeroSection
            eyebrow="Eyebrow"
            title="Title"
            endWords={['seen.']}
            subtitle="Subtitle"
            cta={{ text: 'Go Cosmic', href: '/free-mockup' }}
          />
        </ThemeProvider>
      );

      expect(screen.queryByTestId('planet')).not.toBeInTheDocument();
      expect(document.querySelector('canvas')).not.toBeInTheDocument();
      expect(document.querySelector('.sun-disc')).toBeInTheDocument();
    });
  });
});
