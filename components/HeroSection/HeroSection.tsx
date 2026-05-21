'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps, CSSProperties, PointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import Starfield from '@/components/Starfield';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

type AccentColor = 'aerospace' | 'royal' | 'jungle';
type HeroVariant = 'default' | 'compact';
type StarfieldDensity = 'low' | 'medium' | 'high';
type LocalizedHref = ComponentProps<typeof Link>['href'];

interface HeroCssProperties extends CSSProperties {
  '--hero-accent-rgb': string;
  '--hero-cta-x': string;
  '--hero-cta-y': string;
  '--hero-opacity': string;
  '--hero-parallax-x': string;
  '--hero-parallax-y': string;
  '--hero-scroll-offset': string;
}

/** Props for the immersive homepage hero section. */
export interface HeroSectionProps {
  /** Headline copy before the animated final word. */
  title: string;
  /** Supporting description displayed below the headline. */
  subtitle: string;
  /** Animated final word. Defaults to "shine". */
  endWord?: string;
  /** Label for the primary call-to-action link. */
  ctaText: string;
  /** Destination for the primary call-to-action link. */
  ctaHref: LocalizedHref;
  /** Density of stars in the canvas background. Defaults to "high". */
  starfieldDensity?: StarfieldDensity;
  /** Normalized starfield speed from 0.1 to 1.0. Defaults to 0.4. */
  starfieldSpeed?: number;
  /** Adds a subtle warp scale to the starfield on hover. Defaults to false. */
  starfieldWarp?: boolean;
  /** Accent used by the end word and CTA glow. Defaults to "aerospace". */
  accentColor?: AccentColor;
  /** Layout density. Defaults to "default". */
  variant?: HeroVariant;
  /** Normalized parallax strength from 0 to 1. Defaults to 0.5. */
  parallaxIntensity?: number;
  /** Disable motion when the user prefers reduced motion. Defaults to true. */
  respectReducedMotion?: boolean;
  /** Additional classes for the section wrapper. */
  className?: string;
  /** Optional section id. */
  id?: string;
}

const accentClasses: Record<AccentColor, { cta: string; rgb: string; text: string }> = {
  aerospace: { cta: 'shadow-aerospace/35 hover:shadow-aerospace/55', rgb: '255 79 0', text: 'text-aerospace' },
  jungle: { cta: 'shadow-jungle/35 hover:shadow-jungle/55', rgb: '41 171 135', text: 'text-jungle' },
  royal: { cta: 'shadow-royal/35 hover:shadow-royal/55', rgb: '120 81 169', text: 'text-royal' },
};

const densityToStarCount: Record<StarfieldDensity, number> = {
  high: 520,
  low: 180,
  medium: 340,
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const getAccent = (accentColor: AccentColor) => {
  switch (accentColor) {
    case 'jungle':
      return accentClasses.jungle;
    case 'royal':
      return accentClasses.royal;
    case 'aerospace':
    default:
      return accentClasses.aerospace;
  }
};

const getStarCount = (density: StarfieldDensity) => {
  switch (density) {
    case 'low':
      return densityToStarCount.low;
    case 'medium':
      return densityToStarCount.medium;
    case 'high':
    default:
      return densityToStarCount.high;
  }
};

const usePrefersReducedMotion = (enabled: boolean) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (!enabled || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [enabled]);

  return enabled && prefersReducedMotion;
};

const HeroSection = ({
  title,
  subtitle,
  endWord = 'shine',
  ctaText,
  ctaHref,
  starfieldDensity = 'high',
  starfieldSpeed = 0.4,
  starfieldWarp = false,
  accentColor = 'aerospace',
  variant = 'default',
  parallaxIntensity = 0.5,
  respectReducedMotion = true,
  className,
  id,
}: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion(respectReducedMotion);
  const accent = getAccent(accentColor);
  const intensity = clamp(parallaxIntensity, 0, 1);
  const speed = clamp(starfieldSpeed, 0.1, 1) * 5;

  const style = useMemo<HeroCssProperties>(
    () => ({
      '--hero-accent-rgb': accent.rgb,
      '--hero-cta-x': '0px',
      '--hero-cta-y': '0px',
      '--hero-opacity': '1',
      '--hero-parallax-x': '0px',
      '--hero-parallax-y': '0px',
      '--hero-scroll-offset': '0px',
    }),
    [accent.rgb]
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const updateScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const viewportHeight = window.innerHeight || 1;
      const progress = clamp(window.scrollY / (viewportHeight * 0.5), 0, 1);
      section.style.setProperty('--hero-scroll-offset', `${progress * 36 * intensity}px`);
      section.style.setProperty('--hero-opacity', `${1 - progress * 0.28}`);
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    return () => window.removeEventListener('scroll', updateScroll);
  }, [intensity, prefersReducedMotion]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || intensity === 0 || frameRef.current !== null) return;

    const { currentTarget, clientX, clientY } = event;
    frameRef.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width - 0.5) * intensity;
      const y = ((clientY - rect.top) / rect.height - 0.5) * intensity;
      currentTarget.style.setProperty('--hero-parallax-x', `${x * 28}px`);
      currentTarget.style.setProperty('--hero-parallax-y', `${y * 18}px`);
      frameRef.current = null;
    });
  };

  const handleCtaPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (prefersReducedMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    event.currentTarget.style.setProperty('--hero-cta-x', `${x}px`);
    event.currentTarget.style.setProperty('--hero-cta-y', `${y}px`);
  };

  const resetCtaPosition = () => {
    ctaRef.current?.style.setProperty('--hero-cta-x', '0px');
    ctaRef.current?.style.setProperty('--hero-cta-y', '0px');
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      style={style}
      className={cn(
        'group bg-void text-ghost relative isolate min-h-[calc(100vh-var(--header-height))] overflow-hidden px-4',
        variant === 'compact' ? 'py-8 sm:py-12 lg:py-14' : 'py-10 sm:py-12 lg:py-16',
        className
      )}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      onPointerMove={handlePointerMove}>
      <div
        className={cn(
          'absolute inset-0 -z-20 translate-x-[var(--hero-parallax-x)] translate-y-[var(--hero-parallax-y)] transition-transform duration-500 ease-out',
          starfieldWarp && !prefersReducedMotion && 'group-hover:scale-[1.03]'
        )}
        aria-hidden="true">
        <Starfield className="h-full w-full opacity-75" starCount={getStarCount(starfieldDensity)} speed={speed} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_42%,rgba(var(--hero-accent-rgb),0.3),transparent_30%),linear-gradient(rgba(248,248,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(248,248,255,0.055)_1px,transparent_1px)] bg-[size:auto,112px_112px,112px_112px]" />

      <div
        className="relative z-10 m-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:gap-8"
        style={{
          opacity: 'var(--hero-opacity)',
          transform: 'translate3d(0, var(--hero-scroll-offset), 0)',
        }}>
        <p className="hero-reveal-line text-ghost/60 text-xs tracking-[0.32em] uppercase [animation-delay:80ms]">
          Studio · Est 2024 · Annecy / Remote
        </p>
        <h1
          className="font-display max-w-[12ch] text-[clamp(2.5rem,11vw,10.5rem)] leading-[0.9] font-bold tracking-[-0.08em] text-balance sm:max-w-[13ch]"
          aria-label={`${title} ${endWord}`}>
          <span className="hero-reveal-line from-ghost via-ghost to-ghost/55 block bg-gradient-to-r bg-clip-text text-transparent [animation-delay:120ms]">
            {title}
          </span>{' '}
          <span
            data-end-word
            className={cn(
              'hero-end-word from-aerospace via-royal to-ghost inline-block bg-gradient-to-r bg-clip-text',
              accent.text
            )}>
            {endWord}
          </span>
        </h1>
        <p className="hero-reveal-line text-ghost/80 max-w-2xl text-lg leading-8 [animation-delay:400ms] sm:text-xl lg:text-2xl">
          {subtitle}
        </p>
        <span
          ref={ctaRef}
          className="hero-cta-magnetic hero-reveal-line inline-flex [animation-delay:600ms]"
          onPointerMove={handleCtaPointerMove}
          onPointerLeave={resetCtaPosition}>
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({ variant: 'aerospace', size: 'lg' }),
              'focus-visible:ring-ghost focus-visible:ring-offset-void gap-3 shadow-2xl transition-[opacity,transform,box-shadow] duration-300 hover:scale-105 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]',
              accent.cta
            )}
            aria-label={ctaText}>
            {ctaText}
            <ArrowRightIcon className="size-5" aria-hidden="true" />
          </Link>
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
