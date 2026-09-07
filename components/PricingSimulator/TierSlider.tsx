'use client';

import { useId } from 'react';

import { cn } from '@/design-system/lib/utils';

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
 * Five-position slider snapping onto fixed pricing tiers. Built on a native
 * range input so keyboard control and screen-reader support come for free;
 * `aria-valuetext` reads out the tier wording rather than the raw index.
 */
export function TierSlider({ label, tiers, value, onChange, disabled = false }: TierSliderProps) {
  const id = useId();
  // `value` is a TierIndex, already clamped onto a valid position.
  // eslint-disable-next-line security/detect-object-injection
  const current = tiers[value];

  return (
    <div className={cn('transition-opacity duration-200', disabled && 'pointer-events-none opacity-40')}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-ghost/55 text-2xs font-mono tracking-[0.2em] uppercase">
          {label}
        </label>
        <p className="font-display text-ghost text-sm font-medium">
          {current?.label}
          <span className="text-aerospace ml-2 font-mono text-xs tabular-nums">{current?.price}</span>
        </p>
      </div>

      <input
        id={id}
        type="range"
        min={0}
        max={MAX_TIER_INDEX}
        step={1}
        value={value}
        disabled={disabled}
        aria-valuetext={current ? `${current.label} — ${current.price}` : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
        className="accent-aerospace bg-ghost/10 mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full"
      />

      {/* Position markers — the wording above already names the selected tier. */}
      <ol aria-hidden="true" className="mt-2 flex justify-between px-0.5">
        {tiers.map((tier, index) => (
          <li
            key={tier.label}
            className={cn('h-1 w-1 rounded-full', index <= value ? 'bg-aerospace/70' : 'bg-ghost/15')}
          />
        ))}
      </ol>
    </div>
  );
}
