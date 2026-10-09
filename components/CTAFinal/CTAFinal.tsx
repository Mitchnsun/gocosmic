'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ComponentProps, ReactNode } from 'react';

import { useResolvedTheme } from '@/components/Theme';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';

import { REST_SPEED, TONE_PRESETS, WARP_DENSITY_MULTIPLIER, WARP_SPEED } from './CTAFinal.constants';
import type { Tone } from './CTAFinal.types';
import { CTAFinalBackdrop } from './CTAFinalBackdrop';
import { useWarpEffect } from './useWarpEffect';

type LocalizedHref = ComponentProps<typeof Link>['href'];

/** Props for the immersive final call-to-action section. */
interface CTAFinalProps {
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
  /** Visual intensity: `'immersive'` for the homepage, `'sober'` for inner pages. Defaults to `'immersive'`. */
  tone?: Tone;
  /** Optional section id. */
  id?: string;
}

/**
 * Final homepage call-to-action with an animated starfield background that
 * enters "warp speed" when the CTA button is hovered or focused. In the light
 * theme there are no stars: the immersive tone shows a warm sun halo instead, and the sober tone
 * stays a flat background.
 *
 * The headline uses an animated accent gradient and the button pulses with a
 * glow effect. All motion is disabled when the user prefers reduced motion: the warp is
 * suppressed, the starfield draws a single static frame and the CTA no longer
 * scales on hover or focus.
 *
 * @component
 */
const CTAFinal = ({ headline, description, note, ctaText, ctaHref, tone = 'immersive', id }: CTAFinalProps) => {
  const prefersReducedMotion = usePrefersReducedMotion(true);
  const preset = TONE_PRESETS[tone];
  const light = useResolvedTheme() === 'light';
  // The light theme has no stars, so there is nothing to warp.
  const warpEnabled = preset.warp && !prefersReducedMotion && !light;
  const { isWarping, startWarp, stopWarp } = useWarpEffect(warpEnabled);

  const currentSpeed = isWarping ? WARP_SPEED : REST_SPEED;
  const currentStarCount = isWarping ? Math.round(preset.starCount * WARP_DENSITY_MULTIPLIER) : preset.starCount;

  return (
    <section
      id={id}
      data-reduced-motion={prefersReducedMotion ? 'true' : 'false'}
      data-warping={isWarping ? 'true' : 'false'}
      data-tone={tone}
      className={cn('group text-fg bg-bg relative isolate overflow-hidden px-4 sm:px-6', preset.section)}>
      <CTAFinalBackdrop preset={preset} starCount={currentStarCount} speed={currentSpeed} />

      <div className="relative z-10 m-auto flex max-w-5xl flex-col items-center gap-6 text-center">
        <h2 className={cn('font-display leading-[1.05] font-bold tracking-[-0.04em] text-balance', preset.headline)}>
          <span
            className={cn({
              'cta-final-headline from-aerospace-ink via-fg to-aerospace-ink bg-linear-to-r bg-clip-text text-transparent':
                preset.gradientHeadline,
            })}>
            {headline}
          </span>
        </h2>
        <p className={cn('max-w-xl', preset.description)}>{description}</p>
        {note && <p className="text-fg-3 max-w-xl text-sm">{note}</p>}
        <Link
          href={ctaHref}
          onPointerEnter={startWarp}
          onPointerLeave={stopWarp}
          onFocus={startWarp}
          onBlur={stopWarp}
          className={cn(
            buttonVariants({ variant: 'aerospace', size: preset.buttonSize }),
            'focus-visible:ring-fg focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-100',
            preset.button,
            {
              'cta-final-glow': preset.glowButton,
              'transition-transform duration-300 ease-out': !prefersReducedMotion,
            },
            // CSS fallback for the server-rendered markup, before the hook resolves the media query.
            'motion-reduce:scale-100! motion-reduce:transition-none!',
            !prefersReducedMotion && preset.buttonMotion
          )}
          aria-label={ctaText}>
          {ctaText}
          <ArrowRightIcon className={preset.arrow} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};

export default CTAFinal;
