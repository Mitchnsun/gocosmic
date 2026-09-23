import type { AccentColor, StarfieldDensity, Tone, TonePreset, Variant } from './CTAFinal.types';

/** Accent colours expressed as space-separated RGB channels for `rgb()`. */
export const ACCENT_RGB: Record<AccentColor, string> = {
  aerospace: '255 79 0',
  royal: '120 81 169',
  jungle: '41 171 135',
};

/** Tailwind background utility for the headline gradient per accent colour. */
export const ACCENT_GRADIENT: Record<AccentColor, string> = {
  aerospace: 'from-aerospace via-ghost to-aerospace',
  royal: 'from-royal via-ghost to-royal',
  jungle: 'from-jungle via-ghost to-jungle',
};

/** Rest star count for each density level. */
export const DENSITY_STAR_COUNT: Record<StarfieldDensity, number> = {
  low: 250,
  medium: 400,
  high: 600,
};

/** Base background per visual variant (rendered behind the starfield). */
export const VARIANT_BACKGROUND: Record<Variant, string> = {
  dark: 'bg-void',
  light: 'bg-space',
  gradient: 'bg-gradient-to-b from-void via-space to-void',
};

/** Scales the conceptual 0–1 speed props to the Starfield's pixels-per-frame units. */
export const SPEED_SCALE = 10;
/** Density multiplier applied to the star count while warping. */
export const WARP_DENSITY_MULTIPLIER = 1.3;

/** Defaults and class names per tone. Explicit props always win over these. */
export const TONE_PRESETS: Record<Tone, TonePreset> = {
  immersive: {
    density: 'high',
    warp: true,
    halo: true,
    gradientHeadline: true,
    glowButton: true,
    buttonSize: 'lg',
    starfieldHover: true,
    section: 'py-12 sm:py-16 lg:py-24',
    starfield: 'opacity-80',
    headline: 'text-[clamp(2.25rem,8vw,6rem)]',
    description: 'text-ghost/70 text-lg leading-8 sm:text-xl',
    button: 'mt-2 gap-3',
    buttonMotion: 'hover:scale-[1.08] focus-visible:scale-[1.08]',
    arrow: 'size-5',
  },
  sober: {
    density: 'low',
    warp: false,
    halo: false,
    gradientHeadline: false,
    glowButton: false,
    buttonSize: 'default',
    starfieldHover: false,
    section: 'py-10 sm:py-12 lg:py-16',
    starfield: 'opacity-50',
    headline: 'text-ghost text-[clamp(1.75rem,4vw,3rem)]',
    description: 'text-ghost/60 text-base leading-7 sm:text-lg',
    button: 'gap-2',
    buttonMotion: 'hover:scale-[1.03] focus-visible:scale-[1.03]',
    arrow: 'size-4',
  },
};
