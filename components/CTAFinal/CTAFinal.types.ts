export type AccentColor = 'aerospace' | 'royal' | 'jungle';
export type StarfieldDensity = 'low' | 'medium' | 'high';
/** Base background rendered behind the starfield. */
export type Variant = 'dark' | 'light' | 'gradient';
/** Visual intensity: `immersive` for the homepage, `sober` for inner pages. */
export type Tone = 'immersive' | 'sober';

/** Defaults and class names driven by a {@link Tone}. */
export interface TonePreset {
  /** Default starfield density. */
  density: StarfieldDensity;
  /** Whether hovering or focusing the CTA warps the starfield by default. */
  warp: boolean;
  /** Whether the accent halo is rendered behind the content. */
  halo: boolean;
  /** Whether the headline uses the animated accent gradient. */
  gradientHeadline: boolean;
  /** Whether the CTA button pulses with a glow. */
  glowButton: boolean;
  /** Button size passed to `buttonVariants()`. */
  buttonSize: 'default' | 'lg';
  /** Whether the starfield brightens on section hover. */
  starfieldHover: boolean;
  section: string;
  starfield: string;
  headline: string;
  description: string;
  button: string;
  /** Hover/focus transform classes, dropped when the visitor prefers reduced motion. */
  buttonMotion: string;
  arrow: string;
}
