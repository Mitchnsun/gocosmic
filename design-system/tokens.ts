/** Theme faces of the site, as set by `data-theme` (DESIGN_GUIDELINE.md §1). */
export type ThemeFace = 'dark' | 'light';

export interface DesignToken {
  /** Token name, i.e. the `--t-*` variable and the Tailwind colour, e.g. `fg-2`. */
  name: string;
  /** Background utility painting the swatch, spelled out so Tailwind generates it. */
  swatch: string;
  role: string;
  /** Value of the `--t-*` variable in each theme, exactly as written in `app/globals.css`. */
  values: Record<ThemeFace, string>;
  /** Token the colour is read on, for the WCAG ratio; omitted for backgrounds and hairlines. */
  readOn?: string;
}

/**
 * Semantic colour tokens (DESIGN_GUIDELINE.md §2.1), mirroring the `--t-*` variables of
 * `app/globals.css`: `__tests__/design-system/tokens.test.ts` fails as soon as the two drift apart.
 */
export const DESIGN_TOKENS: readonly DesignToken[] = [
  { name: 'bg', swatch: 'bg-bg', role: 'Page background', values: { dark: '#020617', light: '#fff8e7' } },
  {
    name: 'bg-alt',
    swatch: 'bg-bg-alt',
    role: 'Alternate section, one in three at most',
    values: { dark: '#1c1012', light: '#ffe4e1' },
  },
  {
    name: 'surface',
    swatch: 'bg-surface',
    role: 'Card lifted from the background',
    values: { dark: 'rgb(248 248 255 / 0.02)', light: 'rgb(2 6 23 / 0.02)' },
  },
  {
    name: 'field',
    swatch: 'bg-field',
    role: 'Form control background',
    values: { dark: 'rgb(248 248 255 / 0.03)', light: '#fff8e7' },
  },
  {
    name: 'fg',
    swatch: 'bg-fg',
    role: 'Primary text, strong borders',
    values: { dark: '#f8f8ff', light: '#020617' },
    readOn: 'bg',
  },
  {
    name: 'fg-2',
    swatch: 'bg-fg-2',
    role: 'Secondary text: leads, descriptions',
    values: { dark: 'rgb(248 248 255 / 0.7)', light: 'rgb(2 6 23 / 0.7)' },
    readOn: 'bg',
  },
  {
    name: 'fg-3',
    swatch: 'bg-fg-3',
    role: 'Meta, mono labels, placeholders',
    values: { dark: 'rgb(248 248 255 / 0.5)', light: 'rgb(2 6 23 / 0.6)' },
    readOn: 'bg',
  },
  {
    name: 'line',
    swatch: 'bg-line',
    role: 'Hairline, subtle border, hover tint',
    values: { dark: 'rgb(248 248 255 / 0.08)', light: 'rgb(2 6 23 / 0.08)' },
  },
  {
    name: 'line-2',
    swatch: 'bg-line-2',
    role: 'Stronger border',
    values: { dark: 'rgb(248 248 255 / 0.15)', light: 'rgb(2 6 23 / 0.15)' },
  },
  {
    name: 'ok',
    swatch: 'bg-ok',
    role: 'Available, included, success',
    values: { dark: '#29ab87', light: '#16745a' },
    readOn: 'bg',
  },
  {
    name: 'on-ok',
    swatch: 'bg-on-ok',
    role: 'Label on an ok fill',
    values: { dark: '#020617', light: '#fff8e7' },
    readOn: 'ok',
  },
  {
    name: 'aerospace-ink',
    swatch: 'bg-aerospace-ink',
    role: 'Orange text and focus rings',
    values: { dark: '#ff4f00', light: '#b83a00' },
    readOn: 'bg',
  },
  {
    name: 'royal-ink',
    swatch: 'bg-royal-ink',
    role: 'Purple text, project accents',
    values: { dark: '#b97bff', light: '#7851a9' },
    readOn: 'bg',
  },
];

/** Value of a token in a theme. */
export const tokenValue = ({ values }: DesignToken, theme: ThemeFace): string =>
  theme === 'dark' ? values.dark : values.light;
