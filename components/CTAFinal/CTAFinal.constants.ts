import type { Tone, TonePreset } from './CTAFinal.types';

/** Starfield speed at rest and while warping, in the Starfield's pixels-per-frame units. */
export const REST_SPEED = 2;
export const WARP_SPEED = 8;
/** Density multiplier applied to the star count while warping. */
export const WARP_DENSITY_MULTIPLIER = 1.3;

/** Behaviour and class names per tone. */
export const TONE_PRESETS: Record<Tone, TonePreset> = {
  immersive: {
    starCount: 600,
    warp: true,
    halo: true,
    gradientHeadline: true,
    glowButton: true,
    buttonSize: 'lg',
    starfieldHover: true,
    section: 'py-12 sm:py-16 lg:py-24',
    starfield: 'opacity-80',
    headline: 'text-[clamp(2.25rem,8vw,6rem)]',
    description: 'text-fg-2 text-lg leading-8 sm:text-xl',
    button: 'mt-2 gap-3',
    buttonMotion: 'hover:scale-[1.08] focus-visible:scale-[1.08]',
    arrow: 'size-5',
  },
  sober: {
    starCount: 250,
    warp: false,
    halo: false,
    gradientHeadline: false,
    glowButton: false,
    buttonSize: 'default',
    starfieldHover: false,
    section: 'py-10 sm:py-12 lg:py-16',
    starfield: 'opacity-50',
    headline: 'text-fg text-[clamp(1.75rem,4vw,3rem)]',
    description: 'text-fg-2 text-base leading-7 sm:text-lg',
    button: 'gap-2',
    buttonMotion: 'hover:scale-[1.03] focus-visible:scale-[1.03]',
    arrow: 'size-4',
  },
};
