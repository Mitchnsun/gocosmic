'use client';

import { BOOT_SCRIPT_TYPE, THEME_COLOR_BOOT_SCRIPT } from './Theme.boot';

/** Inline pre-paint script restoring the light `theme-color`; render it at the top of <body>. */
export function ThemeColorBoot() {
  return (
    <script
      type={BOOT_SCRIPT_TYPE}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: THEME_COLOR_BOOT_SCRIPT }}
    />
  );
}
