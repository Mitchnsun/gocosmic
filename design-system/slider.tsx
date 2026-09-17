'use client';

import * as SliderPrimitive from '@radix-ui/react-slider';
import * as React from 'react';

import { cn } from './lib/utils';

/** Shared transition for the fill and thumb so they glide together between steps. */
const GLIDE = 'transition-transform duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none';

export type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  /** Forwarded to the (single) thumb — Radix reads slider text off the thumb, not the root. */
  'aria-labelledby'?: string;
  'aria-valuetext'?: string;
};

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, 'aria-labelledby': ariaLabelledBy, 'aria-valuetext': ariaValueText, ...props }, ref) => (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        // Opacity for the disabled state is left to the caller (see TierSlider), which dims the
        // slider together with its surrounding label — applying it here too would compound.
        'relative flex w-full touch-none items-center select-none data-[disabled]:pointer-events-none',
        className
      )}
      {...props}>
      <SliderPrimitive.Track className="bg-ghost/10 relative h-1.5 w-full grow rounded-full">
        <SliderPrimitive.Range className={cn('bg-aerospace absolute h-full rounded-full', GLIDE)} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        aria-labelledby={ariaLabelledBy}
        aria-valuetext={ariaValueText}
        className={cn(
          'bg-ghost ring-aerospace block h-4 w-4 rounded-full ring-2',
          'shadow-[0_0_0_4px_rgba(255,79,0,0.2)]',
          'hover:scale-110 active:scale-95',
          'focus-visible:ring-offset-void focus-visible:ring-offset-2 focus-visible:outline-none',
          'cursor-grab active:cursor-grabbing',
          GLIDE
        )}
      />
    </SliderPrimitive.Root>
  )
);
Slider.displayName = 'Slider';

export { Slider };
