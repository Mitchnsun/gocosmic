'use client';

import { useTheme } from 'next-themes';
import { useCallback, useSyncExternalStore } from 'react';

import { DEFAULT_THEME, type Theme, THEME_FADE_MS, THEME_RISE_MS } from './Theme.constants';

const subscribe = () => () => {};

/**
 * The theme to render with. The server (and the hydration pass) cannot know the stored choice, so
 * they render the default theme; the stored one takes over right after hydration. Visuals that must
 * be right from the first paint should rely on the `light:` CSS variant instead.
 */
export function useResolvedTheme(): Theme {
  const { resolvedTheme } = useTheme();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return hydrated && resolvedTheme === 'light' ? 'light' : DEFAULT_THEME;
}

/**
 * Switches between the two themes. Unless the visitor prefers reduced motion, <html> briefly carries
 * `theme-fade` (colours cross-fade over 300 ms) and, towards the light theme, `theme-rise` (the sun and
 * its halos rise into place). Both classes only exist during a switch, so page loads never animate.
 */
export function useThemeSwitch() {
  const { setTheme } = useTheme();
  const theme = useResolvedTheme();

  const switchTheme = useCallback(() => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    const root = document.documentElement;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.classList.add('theme-fade');
      window.setTimeout(() => root.classList.remove('theme-fade'), THEME_FADE_MS);
      if (next === 'light') {
        root.classList.add('theme-rise');
        window.setTimeout(() => root.classList.remove('theme-rise'), THEME_RISE_MS);
      }
    }

    setTheme(next);
  }, [theme, setTheme]);

  return { theme, switchTheme };
}
