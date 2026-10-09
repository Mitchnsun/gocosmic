'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps } from 'react';

import { type Fact, FactsLine } from '@/components/FactsLine';
import AnimatedEndWord from '@/components/HeroSection/AnimatedEndWord';
import HeroIllustration from '@/components/HeroSection/HeroIllustration';
import { useWordCycler } from '@/components/HeroSection/HeroSection.hooks';
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
  facts?: Fact[];
  /** Milliseconds between word changes. Defaults to 4000. */
  wordInterval?: number;
  className?: string;
  id?: string;
}

/**
 * Editorial homepage hero: left-aligned headline with an italic emphasis that
 * cycles through the promise, over a discreet starfield and an animated
 * ringed planet (dark theme) or a rising sun (light theme). Everything freezes
 * when the visitor prefers reduced motion.
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
        'bg-bg text-fg relative isolate overflow-hidden pt-[clamp(4rem,10vw,8rem)] pb-[clamp(3.5rem,7.5vw,6rem)]',
        className
      )}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}>
      <HeroIllustration reducedMotion={prefersReducedMotion} />

      <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
        <Eyebrow className="hero-reveal-line">{eyebrow}</Eyebrow>
        <h1
          className="font-display max-w-[16ch] text-[clamp(2.5rem,7.2vw,6.5rem)] leading-[0.98] font-semibold tracking-[-0.035em] text-balance"
          aria-label={`${title} ${currentWord}`}>
          <span className="hero-reveal-line [animation-delay:120ms]">{title} </span>
          <em className="hero-reveal-line text-fg-2 inline-block font-light [animation-delay:300ms]">
            <AnimatedEndWord word={currentWord} prefersReducedMotion={prefersReducedMotion} />
          </em>
        </h1>
        <p className="hero-reveal-line text-fg-2 max-w-[56ch] text-[clamp(1rem,1.4vw,1.1875rem)] leading-relaxed text-pretty [animation-delay:400ms]">
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
        {facts.length > 0 && <FactsLine facts={facts} />}
      </div>
    </section>
  );
};

export default HeroSection;
