'use client';

import { InformationCircleIcon } from '@heroicons/react/24/outline';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { type ReactNode, useId } from 'react';

import { cn } from './lib/utils';

interface InfoPopoverProps {
  /** Accessible name of the trigger, e.g. "More about: Contact form". */
  label: string;
  /** Visible heading of the bubble, which also names it for screen readers. */
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Small "i" button that opens a bubble of context on click or tap, so it also works on touch
 * screens (a hover tooltip would not). Escape or a click outside closes it and focus returns
 * to the button. The trigger keeps a 44 px hit area around its 20 px icon.
 */
export function InfoPopover({ label, title, children, className }: InfoPopoverProps) {
  const titleId = useId();

  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger
        aria-label={label}
        className={cn(
          'text-fg-3 hover:text-fg data-[state=open]:text-aerospace-ink inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors',
          'focus-visible:ring-aerospace-ink focus-visible:ring-2 focus-visible:outline-none',
          className
        )}>
        <InformationCircleIcon className="size-5" aria-hidden="true" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          aria-labelledby={titleId}
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            'border-line-2 bg-bg-alt text-fg-2 z-50 flex w-[min(20rem,var(--radix-popover-content-available-width))] flex-col gap-2 rounded-2xl border p-4 text-sm leading-relaxed shadow-lg',
            'focus-visible:ring-aerospace-ink focus-visible:ring-2 focus-visible:outline-none'
          )}>
          <p id={titleId} className="font-display text-fg font-medium">
            {title}
          </p>
          {children}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
