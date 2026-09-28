import { THEME_COLOR_BOOT_SCRIPT } from './Theme.boot';

/** Inline pre-paint script restoring the light `theme-color`; render it at the top of <body>. */
export function ThemeColorBoot() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_COLOR_BOOT_SCRIPT }} />;
}
