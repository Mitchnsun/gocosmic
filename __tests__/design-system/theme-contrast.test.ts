import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

/**
 * WCAG AA contrast matrix of the semantic colour tokens, read straight from `app/globals.css` so a
 * token edit that breaks readability fails here. Small mono labels (10–11 px) count as body text,
 * so every text token must reach 4.5:1 on every background it sits on, in both themes.
 */

type Rgba = [number, number, number, number];

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

/** Parses `#rrggbb` or `rgb(r g b / a)`, the two notations used by the theme variables. */
const parseColor = (value: string): Rgba => {
  if (value.startsWith('#') && value.length === 7) {
    const n = Number.parseInt(value.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, 1];
  }
  if (value.startsWith('rgb(')) {
    const [r = 0, g = 0, b = 0, a = 1] = value
      .slice(4, -1)
      .split(/[\s/]+/)
      .filter(Boolean)
      .map(Number);
    return [r, g, b, a];
  }
  throw new Error(`Unsupported colour ${value}`);
};

/** Paints a translucent colour over an opaque one. */
const over = ([r, g, b, a]: Rgba, [br, bg, bb]: Rgba): Rgba => [
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

const contrast = (text: Rgba, background: Rgba) => {
  const [a, b] = [luminance(over(text, background)), luminance(background)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const AA = 4.5;
const THEMES = {
  dark: readThemeTokens("[data-theme='dark']"),
  light: readThemeTokens("[data-theme='light']"),
};
const ORANGE = parseColor('#ff4f00');
const VOID = parseColor('#020617');

describe.each(Object.entries(THEMES))('%s theme tokens', (_theme, tokens) => {
  const color = (name: string) => parseColor(tokens.get(name) ?? '');
  const page = color('bg');
  const alternate = color('bg-alt');
  const backgrounds = {
    bg: page,
    'bg-alt': alternate,
    'surface on bg': over(color('surface'), page),
    'surface on bg-alt': over(color('surface'), alternate),
  };

  it('declares every semantic token', () => {
    expect([...tokens.keys()]).toEqual(
      expect.arrayContaining([
        'bg',
        'bg-alt',
        'surface',
        'field',
        'fg',
        'fg-2',
        'fg-3',
        'line',
        'line-2',
        'ok',
        'on-ok',
        'aerospace-ink',
      ])
    );
  });

  describe.each(Object.entries(backgrounds))('on %s', (_name, background) => {
    it.each(['fg', 'fg-2', 'fg-3', 'ok', 'aerospace-ink'])('%s text reaches AA', (text) => {
      expect(contrast(color(text), background)).toBeGreaterThanOrEqual(AA);
    });
  });

  it('keeps placeholders readable on form fields', () => {
    for (const background of [page, alternate]) {
      expect(contrast(color('fg-3'), over(color('field'), background))).toBeGreaterThanOrEqual(AA);
    }
  });

  it('keeps labels readable on the green and orange fills', () => {
    expect(contrast(color('on-ok'), color('ok'))).toBeGreaterThanOrEqual(AA);
    expect(contrast(VOID, ORANGE)).toBeGreaterThanOrEqual(AA);
  });

  it('keeps the orange focus ring visible (3:1 for non-text contrast)', () => {
    expect(contrast(color('aerospace-ink'), page)).toBeGreaterThanOrEqual(3);
    expect(contrast(color('aerospace-ink'), alternate)).toBeGreaterThanOrEqual(3);
  });
});
