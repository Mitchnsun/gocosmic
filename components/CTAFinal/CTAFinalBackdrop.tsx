'use client';

import Starfield from '@/components/Starfield';
import { cn } from '@/design-system/lib/utils';

import type { TonePreset } from './CTAFinal.types';

interface CTAFinalBackdropProps {
  preset: TonePreset;
  starCount: number;
  speed: number;
  respectReducedMotion: boolean;
  /** Light theme: no stars, the page colour (and, on the immersive tone, the sun halo) takes over. */
  light: boolean;
}

/**
 * Layers behind the closing call-to-action: the starfield and the accent halo, or, in the light theme,
 * no stars and, on the immersive tone, a warm sun halo over a misty-rose floor. The `light:` CSS variant
 * picks the scene from the first paint, then the starfield unmounts once the light theme is known so its
 * animation loop stops.
 */
export function CTAFinalBackdrop({ preset, starCount, speed, respectReducedMotion, light }: CTAFinalBackdropProps) {
  return (
    <>
      {!light && (
        <div className="light:hidden absolute inset-0 -z-20" aria-hidden="true">
          <Starfield
            className={cn('h-full w-full', preset.starfield, {
              'transition-opacity duration-300 group-hover:opacity-100': preset.starfieldHover,
            })}
            starCount={starCount}
            speed={speed}
            respectReducedMotion={respectReducedMotion}
          />
        </div>
      )}
      {preset.halo && (
        <div
          className="light:hidden pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 60%, rgb(var(--cta-accent-rgb) / 0.22), transparent 60%)',
          }}
          aria-hidden="true"
        />
      )}
      {preset.halo && (
        <>
          <div
            className="rose-floor light:block pointer-events-none absolute inset-0 -z-20 hidden"
            aria-hidden="true"
          />
          <div
            className="sun-glow light:block pointer-events-none absolute top-[60%] left-1/2 -z-10 hidden aspect-square w-[min(70vw,900px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
}
