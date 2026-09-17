'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import Starfield from '@/components/Starfield';
import type { AccentToken } from '@/design-system/accent';
import { accentClasses } from '@/design-system/accent';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

type LocalizedHref = ComponentProps<typeof Link>['href'];

interface PageHeroCssProperties extends CSSProperties {
  '--page-hero-accent-rgb': string;
}

/** Star count per density preset — deliberately lighter than the homepage hero. */
const DENSITY_STAR_COUNT = { low: 140, medium: 260 } as const;

export interface PageHeroLink {
  /** Visible label. */
  text: string;
  /** Localized destination. */
  href: LocalizedHref;
}

/** Props for the inner-page hero section. */
export interface PageHeroProps {
  /** Uppercase mono eyebrow announcing the page. */
  eyebrow: string;
  /** Page headline, rendered as the `h1`. */
  title: ReactNode;
  /** Supporting lead paragraph. */
  lead?: string;
  /** Primary call-to-action. */
  cta?: PageHeroLink;
  /** Secondary, ghost-styled call-to-action. */
  secondaryCta?: PageHeroLink;
  /** Mono HUD metadata rendered under the hero. */
  meta?: string[];
  /** Accent colour for the eyebrow, glow and primary CTA. Defaults to `'aerospace'`. */
  accent?: AccentToken;
  /** Starfield density preset. Defaults to `'low'`. */
  starfieldDensity?: keyof typeof DENSITY_STAR_COUNT;
  /** Whether to honour `prefers-reduced-motion`. Defaults to `true`. */
  respectReducedMotion?: boolean;
  /** Additional classes for the section wrapper. */
  className?: string;
  /** Section id. Defaults to `'page-hero'`. */
  id?: string;
}

/**
 * Immersive hero for inner pages: subtle starfield, accent glow, mono eyebrow,
 * oversized display headline and up to two calls-to-action.
 *
 * Motion is limited to the starfield, which freezes when the visitor prefers
 * reduced motion.
 *
 * @component
 */
const PageHero = ({
  eyebrow,
  title,
  lead,
  cta,
  secondaryCta,
  meta,
  accent = 'aerospace',
  starfieldDensity = 'low',
  respectReducedMotion = true,
  className,
  id = 'page-hero',
}: PageHeroProps) => {
  const prefersReducedMotion = usePrefersReducedMotion(respectReducedMotion);
  const { text, bg, rgb } = accentClasses(accent);
  // eslint-disable-next-line security/detect-object-injection
  const starCount = DENSITY_STAR_COUNT[starfieldDensity] ?? DENSITY_STAR_COUNT.low;
  const style: PageHeroCssProperties = { '--page-hero-accent-rgb': rgb };

  return (
    <section
      id={id}
      style={style}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      aria-labelledby={`${id}-heading`}
      className={cn(
        'bg-void text-ghost relative isolate overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28',
        className
      )}>
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Starfield className="h-full w-full opacity-60" starCount={starCount} speed={prefersReducedMotion ? 0 : 1.2} />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 15%, rgb(var(--page-hero-accent-rgb) / 0.18), transparent 55%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 m-auto flex max-w-7xl flex-col gap-6">
        <p className={cn('text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase', text)}>
          <span className={cn('h-1.5 w-1.5 rounded-full', bg)} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1
          id={`${id}-heading`}
          className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance">
          {title}
        </h1>
        {lead && <p className="text-ghost/55 max-w-2xl text-lg leading-8">{lead}</p>}
        {(cta || secondaryCta) && (
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
            {cta && (
              <Link
                href={cta.href}
                className={cn(
                  buttonVariants({ variant: accent === 'ghost' ? 'ghost' : accent }),
                  'focus-visible:ring-ghost focus-visible:ring-offset-void w-fit gap-2 py-3 transition-transform duration-300 ease-out hover:scale-105 focus-visible:ring-2 focus-visible:ring-offset-2'
                )}>
                {cta.text}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost focus-visible:ring-offset-void font-display w-fit rounded-full border px-6 py-3 text-base transition-colors focus-visible:ring-2 focus-visible:ring-offset-2">
                {secondaryCta.text}
              </Link>
            )}
          </div>
        )}
        {meta && meta.length > 0 && (
          <ul className="text-ghost/35 text-3xs mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono tracking-[0.2em] uppercase">
            {meta.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default PageHero;
