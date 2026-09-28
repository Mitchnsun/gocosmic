/** The two faces of the site: space (dark, the default) and star (light). */
export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'dark';

/** localStorage key of the visitor's choice: a plain preference, outside the cookie consent. */
export const THEME_STORAGE_KEY = 'cs-theme';

/** How long <html> keeps the switch classes: the 300 ms colour fade and the 900 ms sunrise, plus margin. */
export const THEME_FADE_MS = 350;
export const THEME_RISE_MS = 1000;

/** Browser chrome colour per theme, matching the page background (`bg` token). */
export const THEME_COLORS: Record<Theme, string> = {
  dark: '#020617',
  light: '#fff8e7',
};
