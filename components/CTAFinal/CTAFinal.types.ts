/** Visual intensity: `immersive` for the homepage, `sober` for inner pages. */
export type Tone = 'immersive' | 'sober';

/** Defaults and class names driven by a {@link Tone}. */
export interface TonePreset {
  /** Stars drawn at rest. */
  starCount: number;
  /** Button size passed to `buttonVariants()`. */
  buttonSize: 'default' | 'lg';
  section: string;
  starfield: string;
  headline: string;
  description: string;
  button: string;
  /** Hover/focus transform classes, dropped when the visitor prefers reduced motion. */
  buttonMotion: string;
  arrow: string;
}
