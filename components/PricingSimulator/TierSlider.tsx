'use client';

import { useId } from 'react';

import { InfoPopover } from '@/design-system/info-popover';
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
  /** Sentence under the slider saying how to enable it, shown while it is disabled. */
  disabledHint?: string;
  /** Optional explanation shown in an info bubble next to the label. */
  info?: { label: string; text: string };
}

/**
 * Slider snapping onto fixed pricing tiers, one position per tier, each marked on the track. Built on
 * the Radix `Slider` primitive, which gives pointer-accurate dragging, click-to-seek and full keyboard
 * support for free; `aria-valuetext` reads out the tier wording rather than the raw index.
 */
export function TierSlider({ label, tiers, value, onChange, disabled = false, disabledHint, info }: TierSliderProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  // `value` is already clamped onto a valid position.
  const current = tiers[value];
  const hint = disabled ? disabledHint : undefined;

  return (
    <div>
      {/* An inactive slider is dimmed and announced as disabled (WCAG exempts inactive controls from contrast). */}
      <div
        role="group"
        aria-labelledby={id}
        aria-disabled={disabled || undefined}
        className={cn('transition-opacity duration-200', { 'pointer-events-none opacity-40': disabled })}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="flex items-center gap-1">
            <span id={id} className="text-fg-2 text-2xs font-mono tracking-[0.2em] uppercase">
              {label}
            </span>
            {info && (
              <InfoPopover label={info.label} title={label} className="-my-2">
                <p>{info.text}</p>
              </InfoPopover>
            )}
          </span>
          <p className="font-display text-fg text-sm font-medium">
            {current?.label}
            <span className="text-aerospace-ink ml-2 text-xs tabular-nums">{current?.price}</span>
          </p>
        </div>

        <div className="mt-2">
          <Slider
            value={[value]}
            onValueChange={([next]) => next !== undefined && onChange(next)}
            min={0}
            max={tiers.length - 1}
            step={1}
            disabled={disabled}
            aria-labelledby={id}
            aria-describedby={hint ? hintId : undefined}
            aria-valuetext={current ? `${current.label} — ${current.price}` : undefined}
          />
        </div>
      </div>
      {hint && (
        <p id={hintId} className="text-fg-2 mt-1 text-sm">
          {hint}
        </p>
      )}
    </div>
  );
}
