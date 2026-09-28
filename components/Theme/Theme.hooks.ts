'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

import { DEFAULT_THEME, type Theme } from './Theme.constants';

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
