'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from './lib/utils';

/** Shared transition for the fill and thumb so they glide together between steps. */
const GLIDE = 'transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none';

/** Visible size of the thumb, in px; Radix keeps it inside the root, so the track is inset to match the end dots. */
const THUMB_SIZE = 16;

/** Size of a step dot, in px (`size-2`). */
const DOT_SIZE = 8;

/** Track inset on each side, so its ends line up with the outer edge of the first and last dots. */
const TRACK_INSET = (THUMB_SIZE - DOT_SIZE) / 2;

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  /** Forwarded to the (single) thumb — Radix reads slider text off the thumb, not the root. */
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-valuetext'?: string;
};

/**
 * One dot per step, placed where the thumb's centre lands: the track is inset by `TRACK_INSET` on each
 * side, so a step at `p` sits `(0.5 - p) × dot` px off its percentage.
 */
function StepMarks({ min, max, step }: { min: number; max: number; step: number }) {
  const count = Math.floor((max - min) / step) + 1;
  if (count < 2 || count > 12) return null;

  return Array.from({ length: count }, (_, index) => {
    const ratio = index / (count - 1);
    return (
      <span
        key={index}
        aria-hidden="true"
        className="bg-fg-3 absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ left: `calc(${ratio * 100}% + ${(0.5 - ratio) * DOT_SIZE}px)` }}
      />
    );
  });
}

const Slider = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-valuetext': ariaValueText,
      ...props
    },
    ref
  ) => (
    <SliderPrimitive.Root
      ref={ref}
      min={min}
      max={max}
      step={step}
      className={cn(
        // 44 px tall, so the whole row is a touch target. Opacity for the disabled state is left to the
        // caller (see TierSlider), which dims the slider together with its surrounding label — applying
        // it here too would compound.
        'relative flex h-11 w-full touch-none items-center select-none data-[disabled]:pointer-events-none',
        className
      )}
      {...props}>
      <SliderPrimitive.Track className="bg-line relative h-1.5 grow rounded-full" style={{ marginInline: TRACK_INSET }}>
        <SliderPrimitive.Range className={cn('bg-aerospace absolute h-full rounded-full', GLIDE)} />
        <StepMarks min={min} max={max} step={step} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-valuetext={ariaValueText}
        className={cn(
          'bg-fg ring-aerospace relative block size-4 rounded-full ring-2',
          // A 44 px hit area around the 16 px thumb.
          "before:absolute before:-inset-3.5 before:rounded-full before:content-['']",
          'shadow-[0_0_0_4px_rgba(255,79,0,0.2)]',
          'hover:scale-110 active:scale-95',
          'focus-visible:ring-offset-bg focus-visible:ring-offset-2 focus-visible:outline-none',
          'cursor-grab active:cursor-grabbing',
          GLIDE
        )}
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = 'Slider';

export { Slider };
