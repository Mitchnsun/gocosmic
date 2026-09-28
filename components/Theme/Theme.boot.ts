import { THEME_COLORS, THEME_STORAGE_KEY } from './Theme.constants';

/** Marks the stand-in `theme-color` tag added before hydration, removed once React's tag is right. */
export const THEME_COLOR_BOOT_ATTRIBUTE = 'data-theme-color-boot';

/**
 * `type` of the inline boot scripts. The server keeps them executable; a copy rendered in the browser
 * (the layout remounts on a locale switch) is an inert data block, so React doesn't warn about it.
 */
export const BOOT_SCRIPT_TYPE = typeof window === 'undefined' ? undefined : 'application/json';

/**
 * Runs before the first paint, like next-themes' own script. The server renders the dark
 * `theme-color`; for a visitor who chose the light theme, this puts a cream one first in <head>, which
 * the browser uses (the first match wins) until the app takes over. It never edits React's tag, so
 * hydration still finds it. Must stay self-contained: it is serialised into an inline script.
 */
export function bootThemeColor(storageKey: string, color: string, attribute: string) {
  try {
    if (localStorage.getItem(storageKey) !== 'light') return;
    const meta = document.createElement('meta');
    meta.name = 'theme-color';
    meta.content = color;
    meta.setAttribute(attribute, '');
    document.head.prepend(meta);
  } catch {
    // Storage unavailable: the default dark chrome stays.
  }
}

export const THEME_COLOR_BOOT_SCRIPT = `(${bootThemeColor.toString()})(${JSON.stringify(THEME_STORAGE_KEY)}, ${JSON.stringify(
  THEME_COLORS.light
)}, ${JSON.stringify(THEME_COLOR_BOOT_ATTRIBUTE)})`;
