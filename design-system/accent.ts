/** Accent tokens usable by page sections. Mirrors the palette documented in DESIGN_GUIDELINE.md. */
export type AccentToken = 'aerospace' | 'royal' | 'jungle' | 'ghost';

interface AccentClasses {
  /** Text colour utility. */
  text: string;
  /** Solid background utility (dots, bullets). */
  bg: string;
  /** Space-separated RGB channels, for `rgb()` in inline gradients. */
  rgb: string;
}

const ACCENTS: Record<AccentToken, AccentClasses> = {
  aerospace: { text: 'text-aerospace-ink', bg: 'bg-aerospace', rgb: '255 79 0' },
  royal: { text: 'text-royal-ink', bg: 'bg-royal', rgb: '120 81 169' },
  jungle: { text: 'text-ok', bg: 'bg-ok', rgb: '41 171 135' },
  ghost: { text: 'text-fg', bg: 'bg-fg', rgb: '248 248 255' },
};

/**
 * Returns the Tailwind utilities and RGB channels for an accent token.
 * Classes are listed statically above so Tailwind can detect them at build time.
 */
export const accentClasses = (token: AccentToken = 'aerospace'): AccentClasses => ACCENTS[token];
