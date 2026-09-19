/** Accent tokens usable by page sections. Mirrors the palette documented in DESIGN_GUIDELINE.md. */
export type AccentToken = 'aerospace' | 'royal' | 'jungle' | 'ghost';

export interface AccentClasses {
  /** Text colour utility. */
  text: string;
  /** Solid background utility (dots, bullets). */
  bg: string;
  /** Border colour utility. */
  border: string;
  /** Space-separated RGB channels, for `rgb()` in inline gradients. */
  rgb: string;
}

const ACCENTS: Record<AccentToken, AccentClasses> = {
  aerospace: { text: 'text-aerospace', bg: 'bg-aerospace', border: 'border-aerospace', rgb: '255 79 0' },
  royal: { text: 'text-royal', bg: 'bg-royal', border: 'border-royal', rgb: '120 81 169' },
  jungle: { text: 'text-jungle', bg: 'bg-jungle', border: 'border-jungle', rgb: '41 171 135' },
  ghost: { text: 'text-ghost', bg: 'bg-ghost', border: 'border-ghost', rgb: '248 248 255' },
};

/**
 * Returns the Tailwind utilities and RGB channels for an accent token.
 * Classes are listed statically above so Tailwind can detect them at build time.
 */
export const accentClasses = (token: AccentToken = 'aerospace'): AccentClasses =>
  // eslint-disable-next-line security/detect-object-injection
  ACCENTS[token] ?? ACCENTS.aerospace;
