'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps, CSSProperties, ReactNode } from 'react';

import Starfield from '@/components/Starfield';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { clamp } from '@/lib/clamp';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

import {
  ACCENT_GRADIENT,
  ACCENT_RGB,
  DENSITY_STAR_COUNT,
  SPEED_SCALE,
  TONE_PRESETS,
  VARIANT_BACKGROUND,
  WARP_DENSITY_MULTIPLIER,
} from './CTAFinal.constants';
import type { AccentColor, StarfieldDensity, Tone, Variant } from './CTAFinal.types';
import { useWarpEffect } from './useWarpEffect';

type LocalizedHref = ComponentProps<typeof Link>['href'];

interface CtaFinalCssProperties extends CSSProperties {
  '--cta-accent-rgb': string;
}

/** Props for the immersive final call-to-action section. */
export interface CTAFinalProps {
  /** Main CTA headline. */
  headline: string;
  /** Supporting description displayed below the headline. */
  description: string;
  /** Optional supporting line rendered between the description and the CTA button. */
  note?: ReactNode;
  /** Label for the call-to-action button. */
  ctaText: string;
  /** Destination for the call-to-action link. */
  ctaHref: LocalizedHref;
  /** Starfield density preset. Defaults to the tone's preset (`'high'` immersive, `'low'` sober). */
  starfieldDensity?: StarfieldDensity;
  /** Initial starfield speed (0–1). Defaults to `0.2`. */
  starfieldSpeed?: number;
  /** Starfield speed while warping (0–1). Defaults to `0.8`. */
  starfieldWarpSpeed?: number;
  /** Enables the warp effect on CTA hover/focus. Defaults to the tone's preset (on when immersive). */
  warpOnHover?: boolean;
  /** Accent colour for the headline gradient and button glow. Defaults to `'aerospace'`. */
  accentColor?: AccentColor;
  /** Visual variant controlling the base background. Defaults to `'dark'`. */
  variant?: Variant;
  /** Visual intensity: `'immersive'` for the homepage, `'sober'` for inner pages. Defaults to `'immersive'`. */
  tone?: Tone;
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
 * {@link CTAFinalProps.respectReducedMotion} is enabled: the warp is
 * suppressed, the starfield draws a single static frame and the CTA no longer
 * scales on hover or focus.
 *
 * @component
 */
const CTAFinal = ({
  headline,
  description,
  note,
  ctaText,
  ctaHref,
  starfieldDensity,
  starfieldSpeed = 0.2,
  starfieldWarpSpeed = 0.8,
  warpOnHover,
  accentColor = 'aerospace',
  variant = 'dark',
  tone = 'immersive',
  respectReducedMotion = true,
  onCtaClick,
  className,
  id,
  children,
}: CTAFinalProps) => {
  const prefersReducedMotion = usePrefersReducedMotion(respectReducedMotion);
  // eslint-disable-next-line security/detect-object-injection
  const preset = TONE_PRESETS[tone];
  const warpEnabled = (warpOnHover ?? preset.warp) && !prefersReducedMotion;
  const { isWarping, startWarp, stopWarp } = useWarpEffect(warpEnabled);

  const restSpeed = clamp(starfieldSpeed, 0, 1) * SPEED_SCALE;
  const warpSpeed = clamp(starfieldWarpSpeed, 0, 1) * SPEED_SCALE;
  const currentSpeed = isWarping ? warpSpeed : restSpeed;

  const baseStarCount = DENSITY_STAR_COUNT[starfieldDensity ?? preset.density];
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
      data-tone={tone}
      className={cn(
        'group text-ghost relative isolate overflow-hidden px-4 sm:px-6',
        preset.section,
        variantBackground,
        className
      )}>
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <Starfield
          className={cn('h-full w-full', preset.starfield, {
            'transition-opacity duration-300 group-hover:opacity-100': preset.starfieldHover,
          })}
          starCount={currentStarCount}
          speed={currentSpeed}
          respectReducedMotion={respectReducedMotion}
        />
      </div>
      {preset.halo && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 60%, rgb(var(--cta-accent-rgb) / 0.22), transparent 60%)',
          }}
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 m-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <h2 className={cn('font-display leading-[1.05] font-bold tracking-[-0.04em] text-balance', preset.headline)}>
          <span
            className={cn(
              { 'cta-final-headline bg-linear-to-r bg-clip-text text-transparent': preset.gradientHeadline },
              preset.gradientHeadline && accentGradient
            )}>
            {headline}
          </span>
        </h2>
        <p className={cn('max-w-xl', preset.description)}>{description}</p>
        {note && <p className="text-ghost/45 max-w-xl text-sm">{note}</p>}
        <Link
          href={ctaHref}
          onClick={onCtaClick}
          onPointerEnter={startWarp}
          onPointerLeave={stopWarp}
          onFocus={startWarp}
          onBlur={stopWarp}
          className={cn(
            buttonVariants({ variant: accentColor, size: preset.buttonSize }),
            'focus-visible:ring-ghost focus-visible:ring-offset-void focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-100',
            preset.button,
            {
              'cta-final-glow': preset.glowButton,
              'transition-transform duration-300 ease-out': !prefersReducedMotion,
              // CSS fallback for the server-rendered markup, before the hook resolves the media query.
              'motion-reduce:scale-100! motion-reduce:transition-none!': respectReducedMotion,
            },
            !prefersReducedMotion && preset.buttonMotion
          )}
          aria-label={ctaText}>
          {ctaText}
          <ArrowRightIcon className={preset.arrow} aria-hidden="true" />
        </Link>
      </div>
      {children && <div className="relative z-10 m-auto mt-12 max-w-7xl pt-10">{children}</div>}
    </section>
  );
};

export default CTAFinal;
