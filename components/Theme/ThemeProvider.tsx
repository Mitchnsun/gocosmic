'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ReactNode } from 'react';

import { BOOT_SCRIPT_TYPE } from './Theme.boot';
import { DEFAULT_THEME, THEME_STORAGE_KEY, THEMES } from './Theme.constants';
import { ThemeColorMeta } from './ThemeColorMeta';

/**
 * Sets `data-theme` on <html> before the first paint (inline script, no flash) and remembers the
 * visitor's choice. Dark is the default and the OS preference is deliberately ignored (EPIC #113).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      themes={[...THEMES]}
      defaultTheme={DEFAULT_THEME}
      enableSystem={false}
      storageKey={THEME_STORAGE_KEY}
      scriptProps={{ type: BOOT_SCRIPT_TYPE }}>
      <ThemeColorMeta />
      {children}
    </NextThemesProvider>
  );
}
