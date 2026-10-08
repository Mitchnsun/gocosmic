'use client';

import { useId } from 'react';

import { cn } from '@/design-system/lib/utils';
import { Slider } from '@/design-system/slider';

interface TierSliderProps {
  label: string;
  /** One entry per slider position, in order. */
  tiers: { label: string; price: string }[];
  /** Current position, already clamped onto `tiers`. */
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  /** Id of a note that explains the current position (e.g. raised by another option). */
  describedBy?: string;
}

/**
 * Slider snapping onto fixed pricing tiers, one position per tier. Built on the Radix
 * `Slider` primitive, which gives pointer-accurate dragging, click-to-seek and
 * full keyboard support for free; `aria-valuetext` reads out the tier wording
 * rather than the raw index.
 */
export function TierSlider({ label, tiers, value, onChange, disabled = false, describedBy }: TierSliderProps) {
  const id = useId();
  // `value` is already clamped onto a valid position.
  // eslint-disable-next-line security/detect-object-injection
  const current = tiers[value];

  return (
    // An inactive slider is dimmed and announced as disabled (WCAG exempts inactive controls from contrast).
    <div
      role="group"
      aria-labelledby={id}
      aria-disabled={disabled || undefined}
      className={cn('transition-opacity duration-200', disabled && 'pointer-events-none opacity-40')}>
      <div className="flex items-baseline justify-between gap-4">
        <span id={id} className="text-fg-2 text-2xs font-mono tracking-[0.2em] uppercase">
          {label}
        </span>
        <p className="font-display text-fg text-sm font-medium">
          {current?.label}
          <span className="text-aerospace-ink ml-2 font-mono text-xs tabular-nums">{current?.price}</span>
        </p>
      </div>

      <div className="mt-4">
        <Slider
          value={[value]}
          onValueChange={([next]) => next !== undefined && onChange(next)}
          min={0}
          max={tiers.length - 1}
          step={1}
          disabled={disabled}
          aria-labelledby={id}
          aria-describedby={describedBy}
          aria-valuetext={current ? `${current.label} — ${current.price}` : undefined}
        />
      </div>
    </div>
  );
}
