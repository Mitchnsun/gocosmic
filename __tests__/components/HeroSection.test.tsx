import { act } from '@testing-library/react';
import { vi } from 'vitest';

import HeroSection from '@/components/HeroSection';

import { render, screen } from '../test-utils';

const { starfieldMock } = vi.hoisted(() => ({
  starfieldMock: vi.fn(({ className }: { className?: string }) => <canvas aria-hidden="true" className={className} />),
}));

vi.mock('@/components/Starfield', () => ({ default: starfieldMock }));

const mockReducedMotion = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({ addEventListener: vi.fn(), matches, removeEventListener: vi.fn() });
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
        { highlight: 'Reply', text: 'within 24 h' },
      ]}
      {...props}
    />
  );

describe('HeroSection', () => {
  beforeEach(() => {
    starfieldMock.mockClear();
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

  it('does not render the 3D planet anymore', () => {
    renderHero();

    expect(screen.queryByTestId('planet')).not.toBeInTheDocument();
  });
});
