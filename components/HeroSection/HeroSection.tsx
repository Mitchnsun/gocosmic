'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps, CSSProperties, PointerEvent } from 'react';
import { useEffect, useRef } from 'react';

import AnimatedEndWord from '@/components/HeroSection/AnimatedEndWord';
import { usePrefersReducedMotion, useWordCycler } from '@/components/HeroSection/HeroSection.hooks';
import Planet from '@/components/Planet';
import Starfield from '@/components/Starfield';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { clamp } from '@/lib/clamp';

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
  /** Ordered list of words to cycle through. Takes priority over endWord. */
  endWords?: string[];
  /** Milliseconds between word changes. Defaults to 5000. */
  wordInterval?: number;
  /** Label for the primary call-to-action link. */
  ctaText: string;
  /** Destination for the primary call-to-action link. */
  ctaHref: LocalizedHref;
  /** Additional classes for the section wrapper. */
  className?: string;
  /** Optional section id. */
  id?: string;
}

const HeroSection = ({
  title,
  subtitle,
  endWord = 'shine',
  endWords,
  wordInterval = 5000,
  ctaText,
  ctaHref,
  className,
  id,
}: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion(true);
  const intensity = 0.5;
  const speed = 0.4 * 5;
  const words = endWords ?? [endWord];
  const currentWord = useWordCycler(words, wordInterval, words.length <= 1);

  const style: HeroCssProperties = {
    '--hero-accent-rgb': '255 79 0',
    '--hero-cta-x': '0px',
    '--hero-cta-y': '0px',
    '--hero-opacity': '1',
    '--hero-parallax-x': '0px',
    '--hero-parallax-y': '0px',
    '--hero-scroll-offset': '0px',
  };

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
    if (prefersReducedMotion || frameRef.current !== null) return;

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
        'group bg-void text-ghost relative isolate overflow-hidden px-4 py-12 sm:py-16 lg:py-18 xl:py-24',
        className
      )}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      onPointerMove={handlePointerMove}>
      <div
        className="absolute inset-0 -z-20 translate-x-(--hero-parallax-x) translate-y-(--hero-parallax-y) transition-transform duration-500 ease-out"
        aria-hidden="true">
        <Starfield className="h-full w-full opacity-75" starCount={500} speed={speed} />
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_42%,rgba(var(--hero-accent-rgb),0.3),transparent_30%),linear-gradient(rgba(248,248,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(248,248,255,0.055)_1px,transparent_1px)] bg-size-[auto,112px_112px,112px_112px]" />
      <div
        className="pointer-events-none absolute top-1/2 -right-30 hidden -translate-y-1/2 lg:block"
        aria-hidden="true">
        <Planet
          size={480}
          parallaxMode="pointer"
          useHeroParallax
          scrollFactor={0.3}
          reducedMotion={prefersReducedMotion}
        />
      </div>

      <div
        className="relative z-10 m-auto flex max-w-7xl flex-col items-center gap-6 text-center sm:gap-8"
        style={{
          opacity: 'var(--hero-opacity)',
          transform: 'translate3d(0, var(--hero-scroll-offset), 0)',
        }}>
        <h1
          className="font-display text-[clamp(2.5rem,9vw,5rem)] leading-none font-bold tracking-[-0.08em] text-balance"
          aria-label={`${title} ${currentWord}`}>
          <span className="hero-reveal-line text-ghost inline bg-clip-text [animation-delay:120ms]">
            {title}&nbsp;&nbsp;
          </span>
          <span data-end-word className={cn('hero-end-word text-aerospace relative inline-block')}>
            <AnimatedEndWord
              word={currentWord}
              className="text-aerospace inline"
              prefersReducedMotion={prefersReducedMotion}
            />
          </span>
        </h1>
        <p className="hero-reveal-line text-ghost/80 max-w-2xl text-lg leading-8 [animation-delay:400ms] sm:text-xl lg:text-2xl">
          {subtitle}
        </p>
        <div className="my-1 flex justify-center lg:hidden" aria-hidden="true">
          <Planet
            size={240}
            parallaxMode="gyro"
            gyroAmplitude={15}
            scrollFactor={0.3}
            reducedMotion={prefersReducedMotion}
          />
        </div>
        <span
          ref={ctaRef}
          className="hero-cta-magnetic hero-reveal-line inline-flex [animation-delay:600ms]"
          onPointerMove={handleCtaPointerMove}
          onPointerLeave={resetCtaPosition}>
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({ variant: 'aerospace', size: 'lg' }),
              'focus-visible:ring-ghost focus-visible:ring-offset-void shadow-aerospace/35 hover:shadow-aerospace/55 gap-3 shadow-2xl transition-[opacity,transform,box-shadow] duration-300 hover:scale-105 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]'
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
