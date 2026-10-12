import type { ColorPaletteKey, FreeMockupValues } from '@/lib/validation/free-mockup.schema';

import type { FreeMockupFormState } from './FreeMockupForm.types';

/** State the form starts from, before any submission. */
export const INITIAL_FREE_MOCKUP_STATE: FreeMockupFormState = { status: 'idle' };

/** Empty values the controlled fields start from. */
export const EMPTY_FREE_MOCKUP_VALUES: FreeMockupValues = {
  email: '',
  colorPalette: '',
  websiteUrl: '',
  wishes: '',
};

/**
 * Three-colour preview shown next to each palette name.
 *
 * These are *content*, not design tokens: they illustrate the mood a visitor is
 * choosing for their own future site, so they deliberately live outside the
 * Cosmic Studio palette.
 */
export const PALETTE_SWATCHES: Record<ColorPaletteKey, readonly [string, string, string]> = {
  sober: ['#F8F8FF', '#8A8F98', '#111318'],
  lakeMountains: ['#D9E4EC', '#3A7CA5', '#0B3C5D'],
  alpineSunset: ['#FFC48A', '#FF7A3C', '#7A2E1E'],
  deepForest: ['#CFE3D4', '#2E7D5B', '#0B3D2E'],
  starryNight: ['#E8E4FF', '#7851A9', '#0B1026'],
  terracottaStone: ['#E8D5BC', '#C4703F', '#5C4033'],
};
