/** RGB channels (0–255) and alpha (0–1). */
type Rgba = [number, number, number, number];

/** Parses `#rrggbb` or `rgb(r g b / a)`, the two notations of the theme variables in `app/globals.css`. */
export const parseColor = (value: string): Rgba => {
  if (/^#[\da-f]{6}$/i.test(value)) {
    const n = Number.parseInt(value.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  if (value.startsWith('rgb(') && value.endsWith(')')) {
    const [r = 0, g = 0, b = 0, a = 1] = value
      .slice(4, -1)
      .split(/[\s/,]+/)
      .filter(Boolean)
      .map(Number);
    return [r, g, b, a];
  }
  throw new Error(`Unsupported colour ${value}`);
};

/** Paints a translucent colour over an opaque one. */
export const over = ([r, g, b, a]: Rgba, [br, bg, bb]: Rgba): Rgba => [
  r * a + br * (1 - a),
  g * a + bg * (1 - a),
  b * a + bb * (1 - a),
  1,
];

const luminance = ([r, g, b]: Rgba) => {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.039_28 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

/** WCAG contrast ratio of a colour (translucent or not) painted on an opaque background, from 1 to 21. */
export const contrastRatio = (foreground: Rgba | string, background: Rgba | string): number => {
  const back = typeof background === 'string' ? parseColor(background) : background;
  const front = typeof foreground === 'string' ? parseColor(foreground) : foreground;
  const [a, b] = [luminance(over(front, back)), luminance(back)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

/** WCAG AA verdict: `aa` for body text (≥ 4.5), `large` for large text and UI parts (≥ 3), `fail` otherwise. */
type ContrastLevel = 'aa' | 'large' | 'fail';

export const contrastLevel = (ratio: number): ContrastLevel => {
  if (ratio >= 4.5) return 'aa';
  return ratio >= 3 ? 'large' : 'fail';
};

/** `#rrggbb` of an opaque colour, e.g. a translucent token once painted on its background. */
export const toHex = ([r, g, b]: Rgba): string =>
  `#${[r, g, b].map((c) => Math.round(c).toString(16).padStart(2, '0')).join('')}`;
