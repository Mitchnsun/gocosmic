import { describe, expect, it } from 'vitest';

import { contrastRatio as contrast, over, parseColor } from '@/design-system/lib/contrast';

import { THEME_TOKENS } from './globals-css';

/**
 * WCAG AA contrast matrix of the semantic colour tokens, read straight from `app/globals.css` so a
 * token edit that breaks readability fails here. Small mono labels (10–11 px) count as body text,
 * so every text token must reach 4.5:1 on every background it sits on, in both themes.
 */

const AA = 4.5;
const THEMES = THEME_TOKENS;
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
        'royal-ink',
      ])
    );
  });

  describe.each(Object.entries(backgrounds))('on %s', (_name, background) => {
    it.each(['fg', 'fg-2', 'fg-3', 'ok', 'aerospace-ink', 'royal-ink'])('%s text reaches AA', (text) => {
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
