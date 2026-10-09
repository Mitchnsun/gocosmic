import { readFileSync } from 'node:fs';

// Vitest runs from the repository root.
const css = readFileSync('app/globals.css', 'utf8');

/** Returns the `--t-*` variables declared in the rule whose selector ends with `selector`. */
const readThemeTokens = (selector: string): Map<string, string> => {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`No rule for ${selector} in globals.css`);
  const body = css.slice(start, css.indexOf('}', start));
  return new Map(
    [...body.matchAll(/--t-([\w-]+):\s*([^;]+);/g)].map(([, name = '', value = '']) => [name, value.trim()])
  );
};

/** Theme variables of both faces, as declared in `app/globals.css`. */
export const THEME_TOKENS = {
  dark: readThemeTokens("[data-theme='dark']"),
  light: readThemeTokens("[data-theme='light']"),
};
