'use client';

import { useEffect } from 'react';

import { THEME_COLOR_BOOT_ATTRIBUTE } from './Theme.boot';
import { THEME_COLORS } from './Theme.constants';
import { useResolvedTheme } from './Theme.hooks';

/** Keeps the browser chrome (`theme-color`) on the page background; React hoists the tag to <head>. */
export function ThemeColorMeta() {
  const theme = useResolvedTheme();

  useEffect(() => {
    // Once this tag carries the stored light theme, the pre-paint stand-in (ThemeColorBoot) can go.
    if (theme === 'light') document.head.querySelector(`meta[${THEME_COLOR_BOOT_ATTRIBUTE}]`)?.remove();
  }, [theme]);

  // eslint-disable-next-line security/detect-object-injection -- theme is the typed Theme union
  return <meta name="theme-color" content={THEME_COLORS[theme]} />;
}
