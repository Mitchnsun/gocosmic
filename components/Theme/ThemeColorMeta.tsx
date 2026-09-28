'use client';

import { THEME_COLORS } from './Theme.constants';
import { useResolvedTheme } from './Theme.hooks';

/** Keeps the browser chrome (`theme-color`) on the page background; React hoists the tag to <head>. */
export function ThemeColorMeta() {
  const theme = useResolvedTheme();

  // eslint-disable-next-line security/detect-object-injection -- theme is the typed Theme union
  return <meta name="theme-color" content={THEME_COLORS[theme]} />;
}
