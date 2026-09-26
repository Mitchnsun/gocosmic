'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps } from 'react';

import AnimatedEndWord from '@/components/HeroSection/AnimatedEndWord';
import { useWordCycler } from '@/components/HeroSection/HeroSection.hooks';
import Planet from '@/components/Planet';
import Starfield from '@/components/Starfield';
import { Eyebrow } from '@/design-system/eyebrow';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, primaryPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

type LocalizedHref = ComponentProps<typeof Link>['href'];

interface HeroLink {
  text: string;
  href: LocalizedHref;
}

/** One entry of the mono facts line, e.g. `Dès 10€` + `/ mois`. */
export interface HeroFact {
  highlight: string;
  text: string;
}

/** Props for the editorial homepage hero. */
export interface HeroSectionProps {
  /** Mono eyebrow above the headline. */
  eyebrow: string;
  /** Headline copy before the emphasised final word. */
  title: string;
  /** Final words cycled in light italic, e.g. `vue.` → `trouvée.` → `choisie.` */
  endWords: string[];
  /** Supporting paragraph below the headline. */
  subtitle: string;
  /** Primary call-to-action. */
  cta: HeroLink;
  /** Secondary, outlined call-to-action. */
  secondaryCta?: HeroLink;
  /** Mono facts line closing the hero. */
  facts?: HeroFact[];
  /** Milliseconds between word changes. Defaults to 4000. */
  wordInterval?: number;
  className?: string;
  id?: string;
}

/**
 * Editorial homepage hero: left-aligned headline with an italic emphasis that
 * cycles through the promise, over a discreet starfield and an animated
 * ringed planet. Everything freezes when the visitor prefers reduced motion.
 */
const HeroSection = ({
  eyebrow,
  title,
  endWords,
  subtitle,
  cta,
  secondaryCta,
  facts = [],
  wordInterval = 4000,
  className,
  id = 'hero',
}: HeroSectionProps) => {
  const prefersReducedMotion = usePrefersReducedMotion(true);
  const currentWord = useWordCycler(endWords, wordInterval, prefersReducedMotion || endWords.length <= 1);

  return (
    <section
      id={id}
      className={cn(
        'bg-void text-ghost relative isolate overflow-hidden pt-[clamp(4.5rem,12vw,9.5rem)] pb-[clamp(4rem,9vw,7.5rem)]',
        className
      )}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}>
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Starfield className="h-full w-full opacity-70" starCount={260} speed={0.6} respectReducedMotion />
      </div>
      <div
        className="pointer-events-none absolute top-1/2 -right-30 -z-10 hidden -translate-y-1/2 lg:block"
        aria-hidden="true">
        <Planet size={480} parallaxMode="pointer" scrollFactor={0.3} reducedMotion={prefersReducedMotion} />
      </div>
      <div className="pointer-events-none absolute -top-16 -right-24 -z-10 opacity-40 lg:hidden" aria-hidden="true">
        <Planet
          size={240}
          parallaxMode="gyro"
          gyroAmplitude={15}
          scrollFactor={0.3}
          reducedMotion={prefersReducedMotion}
        />
      </div>

      <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
        <Eyebrow className="hero-reveal-line">{eyebrow}</Eyebrow>
        <h1
          className="font-display max-w-[16ch] text-[clamp(2.5rem,7.2vw,6.5rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance"
          aria-label={`${title} ${currentWord}`}>
          <span className="hero-reveal-line [animation-delay:120ms]">{title} </span>
          <em className="hero-reveal-line text-ghost/55 inline-block font-light [animation-delay:300ms]">
            <AnimatedEndWord word={currentWord} prefersReducedMotion={prefersReducedMotion} />
          </em>
        </h1>
        <p className="hero-reveal-line text-ghost/70 max-w-[56ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-relaxed text-pretty [animation-delay:400ms]">
          {subtitle}
        </p>
        <div className="hero-reveal-line flex flex-wrap items-center gap-3 [animation-delay:600ms]">
          <Link href={cta.href} className={primaryPill('h-13 px-6.5')}>
            {cta.text}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
          {secondaryCta && (
            <Link href={secondaryCta.href} className={ghostPill('h-13')}>
              {secondaryCta.text}
            </Link>
          )}
        </div>
        {facts.length > 0 && (
          <ul className="border-ghost/8 text-ghost/45 text-2xs flex flex-wrap gap-x-10 gap-y-3 border-t pt-6 font-mono tracking-[0.16em] uppercase">
            {facts.map((fact) => (
              <li key={fact.highlight}>
                <span className="text-ghost">{fact.highlight}</span> {fact.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
