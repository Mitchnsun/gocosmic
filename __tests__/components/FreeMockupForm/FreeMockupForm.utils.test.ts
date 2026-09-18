import {
  COLOR_PALETTE_KEYS,
  EMPTY_FREE_MOCKUP_VALUES,
  getWishesCounter,
  INITIAL_FREE_MOCKUP_STATE,
  PALETTE_SWATCHES,
  WISHES_MAX_LENGTH,
} from '@/components/FreeMockupForm/FreeMockupForm.utils';

describe('FreeMockupForm utils', () => {
  it('starts idle with empty values', () => {
    expect(INITIAL_FREE_MOCKUP_STATE).toEqual({ status: 'idle' });
    expect(EMPTY_FREE_MOCKUP_VALUES).toEqual({ email: '', colorPalette: '', websiteUrl: '', wishes: '' });
  });

  it('exposes a three-colour swatch for every palette', () => {
    const swatches = Object.entries(PALETTE_SWATCHES);

    expect(swatches.map(([paletteKey]) => paletteKey)).toEqual([...COLOR_PALETTE_KEYS]);
    for (const [, colors] of swatches) {
      expect(colors).toHaveLength(3);
    }
  });

  describe('getWishesCounter', () => {
    it('counts an empty value', () => {
      expect(getWishesCounter('')).toEqual({ count: 0, max: WISHES_MAX_LENGTH, isAtLimit: false });
    });

    it('counts a partial value', () => {
      expect(getWishesCounter('hello')).toEqual({ count: 5, max: WISHES_MAX_LENGTH, isAtLimit: false });
    });

    it('flags the limit once it is reached', () => {
      expect(getWishesCounter('a'.repeat(WISHES_MAX_LENGTH)).isAtLimit).toBe(true);
    });
  });
});
