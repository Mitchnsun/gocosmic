'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { cn } from '@/design-system/lib/utils';
import type { ColorPaletteKey } from '@/lib/validation/free-mockup.schema';

import type { ColorPaletteSelectProps } from './FreeMockupForm.types';
import { COLOR_PALETTE_KEYS, PALETTE_SWATCHES } from './FreeMockupForm.utils';

const LEGEND_ID = 'free-mockup-palette-label';
const ERROR_ID = 'free-mockup-palette-error';

/** Three dots previewing the mood of a palette. Purely decorative. */
function PaletteSwatch({ paletteKey }: { paletteKey: ColorPaletteKey }) {
  // eslint-disable-next-line security/detect-object-injection
  const colors = PALETTE_SWATCHES[paletteKey];

  return (
    <span className="flex shrink-0 items-center -space-x-1.5" aria-hidden="true">
      {colors.map((color) => (
        <span key={color} className="border-void/40 h-5 w-5 rounded-full border" style={{ backgroundColor: color }} />
      ))}
    </span>
  );
}

/**
 * Closed list of colour directions, rendered as a native radio group so arrow
 * keys move between options and screen readers announce "n of 6".
 *
 * `role="radiogroup"` is deliberate: a bare fieldset exposes `group`, which does
 * not support `aria-invalid`, so the group could never be announced as invalid.
 * `aria-labelledby` keeps the legend as the accessible name regardless of how
 * the role override is mapped.
 */
export function ColorPaletteSelect({ value, onChange, error, onBlur }: ColorPaletteSelectProps) {
  const t = useTranslations('freeMockup');

  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={LEGEND_ID}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? ERROR_ID : undefined}
      className="flex flex-col gap-3">
      <legend id={LEGEND_ID} className="font-display text-ghost text-sm font-medium">
        {t('form.palette_label')}
      </legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {COLOR_PALETTE_KEYS.map((paletteKey) => {
          const isSelected = value === paletteKey;

          return (
            <label key={paletteKey} className="cursor-pointer">
              <input
                type="radio"
                name="colorPalette"
                value={paletteKey}
                checked={isSelected}
                onChange={() => onChange(paletteKey)}
                onBlur={onBlur}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'peer-focus-visible:ring-aerospace peer-focus-visible:ring-offset-void flex min-h-11 items-center gap-3 rounded-xl border p-3 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
                  isSelected
                    ? 'border-aerospace/40 bg-aerospace/[0.06]'
                    : 'border-ghost/8 bg-ghost/[0.02] hover:border-ghost/15'
                )}>
                <PaletteSwatch paletteKey={paletteKey} />
                <span className={cn('flex-1 text-sm', isSelected ? 'text-ghost' : 'text-ghost/55')}>
                  {t(`palette.options.${paletteKey}`)}
                </span>
                <CheckCircleIcon
                  className={cn(
                    'text-aerospace h-5 w-5 shrink-0 transition-opacity',
                    isSelected ? 'opacity-100' : 'opacity-0'
                  )}
                  aria-hidden="true"
                />
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={ERROR_ID} className="text-aerospace text-sm">
          {t(`validation.${error}`)}
        </p>
      )}
    </fieldset>
  );
}
