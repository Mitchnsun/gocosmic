'use client';

import NightStarfield from '@/components/Starfield/NightStarfield';
import { SunGlow } from '@/components/Sun';
import { cn } from '@/design-system/lib/utils';

import type { TonePreset } from './CTAFinal.types';

interface CTAFinalBackdropProps {
  preset: TonePreset;
  starCount: number;
  speed: number;
}

/**
 * Layers behind the closing call-to-action: the starfield and the accent halo, or, in the light theme,
 * no stars and, on the immersive tone, a warm sun halo over a misty-rose floor. The `light:` CSS variant
 * picks the scene from the first paint, then the starfield unmounts once the light theme is known so its
 * animation loop stops.
 */
export function CTAFinalBackdrop({ preset, starCount, speed }: CTAFinalBackdropProps) {
  return (
    <>
      <NightStarfield
        className={cn('h-full w-full', preset.starfield, {
          'transition-opacity duration-300 group-hover:opacity-100': preset.starfieldHover,
        })}
        starCount={starCount}
        speed={speed}
        respectReducedMotion
      />
      {preset.halo && (
        <div
          className="light:hidden pointer-events-none absolute inset-0 -z-10 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 60%, rgb(255 79 0 / 0.22), transparent 60%)',
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
          <SunGlow className="top-[60%] left-1/2 -z-10 w-[min(70vw,900px)] -translate-x-1/2 -translate-y-1/2" />
        </>
      )}
    </>
  );
}
