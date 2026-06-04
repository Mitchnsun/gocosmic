'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import { usePrefersReducedMotion } from '@/components/HeroSection/HeroSection.hooks';
import Starfield from '@/components/Starfield';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { clamp } from '@/lib/clamp';

import { useWarpEffect } from './useWarpEffect';

type LocalizedHref = ComponentProps<typeof Link>['href'];
type AccentColor = 'aerospace' | 'royal' | 'jungle';
type StarfieldDensity = 'low' | 'medium' | 'high';
type Variant = 'dark' | 'light' | 'gradient';

interface CtaFinalCssProperties extends CSSProperties {
  '--cta-accent-rgb': string;
}

/** Accent colours expressed as space-separated RGB channels for `rgb()`. */
const ACCENT_RGB: Record<AccentColor, string> = {
  aerospace: '255 79 0',
  royal: '120 81 169',
  jungle: '41 171 135',
};

/** Tailwind background utility for the headline gradient per accent colour. */
const ACCENT_GRADIENT: Record<AccentColor, string> = {
  aerospace: 'from-aerospace via-ghost to-aerospace',
  royal: 'from-royal via-ghost to-royal',
  jungle: 'from-jungle via-ghost to-jungle',
};

/** Rest star count for each density level. */
const DENSITY_STAR_COUNT: Record<StarfieldDensity, number> = {
  low: 250,
  medium: 400,
  high: 600,
};

/** Base background per visual variant (rendered behind the starfield). */
const VARIANT_BACKGROUND: Record<Variant, string> = {
  dark: 'bg-void',
  light: 'bg-space',
  gradient: 'bg-gradient-to-b from-void via-space to-void',
};

/** Scales the conceptual 0–1 speed props to the Starfield's pixels-per-frame units. */
const SPEED_SCALE = 10;
/** Density multiplier applied to the star count while warping. */
const WARP_DENSITY_MULTIPLIER = 1.3;

/** Props for the immersive final call-to-action section. */
export interface CTAFinalProps {
  /** Main CTA headline. */
  headline: string;
  /** Supporting description displayed below the headline. */
  description: string;
  /** Label for the call-to-action button. */
  ctaText: string;
  /** Destination for the call-to-action link. */
  ctaHref: LocalizedHref;
  /** Starfield density preset. Defaults to `'high'`. */
  starfieldDensity?: StarfieldDensity;
  /** Initial starfield speed (0–1). Defaults to `0.2`. */
  starfieldSpeed?: number;
  /** Starfield speed while warping (0–1). Defaults to `0.8`. */
  starfieldWarpSpeed?: number;
  /** Enables the warp effect on CTA hover/focus. Defaults to `true`. */
  warpOnHover?: boolean;
  /** Accent colour for the headline gradient and button glow. Defaults to `'aerospace'`. */
  accentColor?: AccentColor;
  /** Visual variant controlling the base background. Defaults to `'dark'`. */
  variant?: Variant;
  /** Whether to honour `prefers-reduced-motion`. Defaults to `true`. */
  respectReducedMotion?: boolean;
  /** Optional callback fired when the CTA is clicked. */
  onCtaClick?: () => void;
  /** Additional classes for the section wrapper. */
  className?: string;
  /** Optional section id. */
  id?: string;
  /** Optional content rendered below the CTA button, inside the starfield. */
  children?: ReactNode;
}

/**
 * Final homepage call-to-action with an animated starfield background that
 * enters "warp speed" when the CTA button is hovered or focused.
 *
 * The headline uses an animated accent gradient and the button pulses with a
 * glow effect. All motion is disabled when the user prefers reduced motion and
 * {@link CTAFinalProps.respectReducedMotion} is enabled, in which case the
 * starfield keeps its rest speed.
 *
 * @component
 */
const CTAFinal = ({
  headline,
  description,
  ctaText,
  ctaHref,
  starfieldDensity = 'high',
  starfieldSpeed = 0.2,
  starfieldWarpSpeed = 0.8,
  warpOnHover = true,
  accentColor = 'aerospace',
  variant = 'dark',
  respectReducedMotion = true,
  onCtaClick,
  className,
  id,
  children,
}: CTAFinalProps) => {
  const prefersReducedMotion = usePrefersReducedMotion(respectReducedMotion);
  const warpEnabled = warpOnHover && !prefersReducedMotion;
  const { isWarping, startWarp, stopWarp } = useWarpEffect(warpEnabled);

  const restSpeed = clamp(starfieldSpeed, 0, 1) * SPEED_SCALE;
  const warpSpeed = clamp(starfieldWarpSpeed, 0, 1) * SPEED_SCALE;
  const currentSpeed = isWarping ? warpSpeed : restSpeed;

  // eslint-disable-next-line security/detect-object-injection
  const baseStarCount = DENSITY_STAR_COUNT[starfieldDensity];
  const currentStarCount = isWarping ? Math.round(baseStarCount * WARP_DENSITY_MULTIPLIER) : baseStarCount;

  // eslint-disable-next-line security/detect-object-injection
  const variantBackground = VARIANT_BACKGROUND[variant];
  // eslint-disable-next-line security/detect-object-injection
  const accentGradient = ACCENT_GRADIENT[accentColor];

  const style: CtaFinalCssProperties = {
    // eslint-disable-next-line security/detect-object-injection
    '--cta-accent-rgb': ACCENT_RGB[accentColor],
  };

  return (
    <section
      id={id}
      style={style}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-warping={isWarping ? 'true' : 'false'}
      className={cn(
        'group text-ghost relative isolate overflow-hidden px-4 py-12 sm:px-6 sm:py-16 lg:py-24',
        variantBackground,
        className
      )}>
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Starfield
          className="h-full w-full opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          starCount={currentStarCount}
          speed={currentSpeed}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 60%, rgb(var(--cta-accent-rgb) / 0.22), transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 m-auto flex max-w-2xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-[clamp(2.25rem,8vw,6rem)] leading-[1.05] font-bold tracking-[-0.04em] text-balance">
          <span className={cn('cta-final-headline bg-linear-to-r bg-clip-text text-transparent', accentGradient)}>
            {headline}
          </span>
        </h2>
        <p className="text-ghost/70 max-w-xl text-lg leading-8 sm:text-xl">{description}</p>
        <Link
          href={ctaHref}
          onClick={onCtaClick}
          onPointerEnter={startWarp}
          onPointerLeave={stopWarp}
          onFocus={startWarp}
          onBlur={stopWarp}
          className={cn(
            buttonVariants({ variant: accentColor, size: 'lg' }),
            'cta-final-glow focus-visible:ring-ghost focus-visible:ring-offset-void mt-2 gap-3 transition-transform duration-300 ease-out hover:scale-[1.08] focus-visible:scale-[1.08] focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-100'
          )}
          aria-label={ctaText}>
          {ctaText}
          <ArrowRightIcon className="size-5" aria-hidden="true" />
        </Link>
      </div>
      {children && <div className="relative z-10 m-auto mt-12 max-w-7xl pt-10">{children}</div>}
    </section>
  );
};

export default CTAFinal;
