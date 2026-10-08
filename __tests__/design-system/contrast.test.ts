import { describe, expect, it } from 'vitest';

import { contrastLevel, contrastRatio, over, parseColor, toHex } from '@/design-system/lib/contrast';

describe('parseColor', () => {
  it('reads hex and rgb() notations', () => {
    expect(parseColor('#FF4F00')).toEqual([255, 79, 0, 1]);
    expect(parseColor('rgb(2 6 23 / 0.6)')).toEqual([2, 6, 23, 0.6]);
    expect(parseColor('rgb(2, 6, 23)')).toEqual([2, 6, 23, 1]);
  });

  it('rejects other notations', () => {
    expect(() => parseColor('red')).toThrow('Unsupported colour red');
  });
});

describe('contrastRatio', () => {
  it('spans 1 to 21', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1);
  });

  it('is symmetric for opaque colours', () => {
    expect(contrastRatio('#ff4f00', '#020617')).toBeCloseTo(contrastRatio('#020617', '#ff4f00'));
  });

  it('paints a translucent text over its background first', () => {
    const background = parseColor('#020617');
    expect(contrastRatio('rgb(248 248 255 / 0.5)', background)).toBeCloseTo(
      contrastRatio(over(parseColor('rgb(248 248 255 / 0.5)'), background), background)
    );
    expect(contrastRatio('rgb(248 248 255 / 0)', background)).toBeCloseTo(1);
  });
});

describe('contrastLevel', () => {
  it('grades a ratio against WCAG AA', () => {
    expect(contrastLevel(4.5)).toBe('aa');
    expect(contrastLevel(3)).toBe('large');
    expect(contrastLevel(2.9)).toBe('fail');
  });
});

describe('toHex', () => {
  it('writes the resolved colour as #rrggbb', () => {
    expect(toHex(parseColor('#ff4f00'))).toBe('#ff4f00');
    expect(toHex(over(parseColor('rgb(255 255 255 / 0.5)'), parseColor('#000000')))).toBe('#808080');
  });
});
