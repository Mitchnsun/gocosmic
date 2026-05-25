'use client';

import type { CSSProperties } from 'react';

import { cn } from '@/design-system/lib/utils';

import { type ParallaxMode, usePlanetAnimation } from './usePlanetAnimation';

interface PlanetCssProperties extends CSSProperties {
  '--planet-reveal-scale': string;
  '--planet-scroll-y': string;
  '--planet-tilt-x': string;
  '--planet-tilt-y': string;
}

export interface PlanetProps {
  /** Wrapper size in pixels. */
  size?: number;
  /** Parallax source. */
  parallaxMode?: ParallaxMode;
  /** Consume HeroSection pointer parallax CSS variables. */
  useHeroParallax?: boolean;
  /** Maximum gyroscope tilt in pixels. */
  gyroAmplitude?: number;
  /** Scroll parallax speed. Set to 0 to disable it. */
  scrollFactor?: number;
  /** Disables all animation effects. */
  reducedMotion?: boolean;
  /** Additional wrapper classes. */
  className?: string;
}

const Planet = ({
  size = 480,
  parallaxMode = 'auto',
  useHeroParallax = false,
  gyroAmplitude = 15,
  scrollFactor = 0.3,
  reducedMotion = false,
  className,
}: PlanetProps) => {
  const { planetRef, wrapperRef } = usePlanetAnimation({
    parallaxMode,
    gyroAmplitude,
    scrollFactor,
    reducedMotion,
  });

  const bodyInset = Math.round(size * 0.1);
  const orbit1Size = Math.round(size * 1.25);
  const orbit2Size = Math.round(size * 1.5);
  const orbit3Size = Math.round(size * 1.125);
  const moonSize = Math.round(size * 0.025);

  const transform = useHeroParallax
    ? `translate(
        calc(var(--planet-tilt-x, 0px) + var(--hero-parallax-x, 0px)),
        calc(var(--planet-tilt-y, 0px) + var(--hero-parallax-y, 0px) + var(--planet-scroll-y, 0px))
      ) scale(var(--planet-reveal-scale, 1))`
    : `translate(
        var(--planet-tilt-x, 0px),
        calc(var(--planet-tilt-y, 0px) + var(--planet-scroll-y, 0px))
      ) scale(var(--planet-reveal-scale, 1))`;

  const wrapperStyle: PlanetCssProperties = {
    width: size,
    height: size,
    '--planet-reveal-scale': '1',
    '--planet-scroll-y': '0px',
    '--planet-tilt-x': '0px',
    '--planet-tilt-y': '0px',
    transform,
  };

  return (
    <div
      ref={wrapperRef}
      style={wrapperStyle}
      className={cn('relative will-change-transform', className)}
      aria-hidden="true">
      <div
        className="animate-planet-glow planet-glow absolute rounded-full blur-2xl"
        style={{ inset: -Math.round(size * 0.0625) }}
      />

      <div
        ref={planetRef}
        className="planet-body-surface absolute overflow-hidden rounded-full will-change-transform"
        style={{ inset: bodyInset }}>
        <div className="planet-band-warm absolute top-[25%] -right-[10%] -left-[10%] h-[14%] rounded-[50%] opacity-35" />
        <div className="planet-band-shadow absolute top-1/2 -right-[10%] -left-[10%] h-[8%] rounded-[50%] opacity-80" />
        <div className="planet-band-royal absolute top-[70%] -right-[10%] -left-[10%] h-[10%] rounded-[50%] opacity-35" />

        <div className="planet-surface-spot absolute top-[30%] left-[20%] h-[30%] w-[40%] rounded-full opacity-35" />
        <div className="planet-surface-spot absolute top-[55%] left-[55%] h-[20%] w-[25%] rounded-full opacity-50" />
      </div>

      <div
        className="animate-orbit planet-orbit-plane absolute rounded-full border border-white/10"
        style={{ width: orbit1Size, height: orbit1Size }}>
        <span
          className="bg-aerospace absolute -top-[6px] left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: moonSize, height: moonSize, boxShadow: `0 0 ${moonSize * 1.3}px #ff4f00` }}
        />
      </div>

      <div
        className="animate-orbit-slow planet-orbit-plane absolute rounded-full border border-white/10"
        style={{ width: orbit2Size, height: orbit2Size }}>
        <span
          className="bg-jungle absolute -top-[6px] left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: moonSize, height: moonSize, boxShadow: `0 0 ${moonSize * 1.3}px #29ab87` }}
        />
      </div>

      <div
        className="planet-orbit-plane pointer-events-none absolute rounded-full border border-dashed border-white/10 opacity-50"
        style={{ width: orbit3Size, height: orbit3Size }}
      />
    </div>
  );
};

export default Planet;
