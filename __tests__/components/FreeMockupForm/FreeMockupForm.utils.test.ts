import {
  EMPTY_FREE_MOCKUP_VALUES,
  INITIAL_FREE_MOCKUP_STATE,
  PALETTE_SWATCHES,
} from '@/components/FreeMockupForm/FreeMockupForm.utils';
import { COLOR_PALETTE_KEYS } from '@/lib/validation/free-mockup.schema';

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
});
