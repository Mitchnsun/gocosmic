'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from './lib/utils';

const Tabs = TabsPrimitive.Root;

/** Pill track holding the triggers side by side, each taking an equal share of the width. */
const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('border-line bg-bg grid auto-cols-fr grid-flow-col gap-1 rounded-full border p-1', className)}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

/**
 * One pill; the active one is filled. Long labels wrap onto two lines instead of overflowing.
 * Radix switches tabs on mouse down and keyboard, so tests must not rely on `click` alone.
 */
const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'font-display min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium text-balance transition-colors',
      'focus-visible:ring-aerospace-ink focus-visible:ring-2 focus-visible:outline-none',
      'data-[state=active]:bg-fg data-[state=active]:text-bg',
      'data-[state=inactive]:text-fg-2 data-[state=inactive]:hover:text-fg',
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

/** Panel of the active tab; Radix makes it focusable, so it gets the same visible focus ring. */
const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'focus-visible:ring-aerospace-ink focus-visible:ring-offset-bg rounded-3xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsContent, TabsList, TabsTrigger };
