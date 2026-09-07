import { cn } from '@/design-system/lib/utils';

/**
 * Border classes for a station cell in the 1 / 2 / 4-column responsive grid
 * (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`). Works for any number of
 * stations: each cell gets a top border unless it starts a new row on mobile,
 * a left border unless it starts a new row at `sm` (2 cols), and a left
 * border at `lg` (4 cols) when it isn't already bordered by the `sm` rule.
 */
export const getStationBorderClass = (index: number): string =>
  cn({
    'border-t': index >= 1,
    'sm:border-t-0': index === 1,
    'sm:border-l': index % 2 === 1,
    'lg:border-t-0': index === 2 || index === 3,
    'lg:border-l': index % 4 !== 0 && index % 2 === 0,
  });
