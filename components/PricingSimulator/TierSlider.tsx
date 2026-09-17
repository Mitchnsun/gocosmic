'use client';

import { useId } from 'react';

import { cn } from '@/design-system/lib/utils';
import { Slider } from '@/design-system/slider';

import { MAX_TIER_INDEX } from './constants';
import type { TierIndex } from './PricingSimulator.types';

interface TierSliderProps {
  label: string;
  /** One entry per slider position, in order. */
  tiers: { label: string; price: string }[];
  value: TierIndex;
  onChange: (value: number) => void;
  disabled?: boolean;
}

/**
 * Five-position slider snapping onto fixed pricing tiers. Built on the Radix
 * `Slider` primitive, which gives pointer-accurate dragging, click-to-seek and
 * full keyboard support for free; `aria-valuetext` reads out the tier wording
 * rather than the raw index.
 */
export function TierSlider({ label, tiers, value, onChange, disabled = false }: TierSliderProps) {
  const id = useId();
  // `value` is a TierIndex, already clamped onto a valid position.
  // eslint-disable-next-line security/detect-object-injection
  const current = tiers[value];

  return (
    <div className={cn('transition-opacity duration-200', disabled && 'pointer-events-none opacity-40')}>
      <div className="flex items-baseline justify-between gap-4">
        <span id={id} className="text-ghost/55 text-2xs font-mono tracking-[0.2em] uppercase">
          {label}
        </span>
        <p className="font-display text-ghost text-sm font-medium">
          {current?.label}
          <span className="text-aerospace ml-2 font-mono text-xs tabular-nums">{current?.price}</span>
        </p>
      </div>

      <div className="mt-4">
        <Slider
          value={[value]}
          onValueChange={([next]) => next !== undefined && onChange(next)}
          min={0}
          max={MAX_TIER_INDEX}
          step={1}
          disabled={disabled}
          aria-labelledby={id}
          aria-valuetext={current ? `${current.label} — ${current.price}` : undefined}
        />
      </div>
    </div>
  );
}
