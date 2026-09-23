'use client';

import type { ReactNode } from 'react';

import { cn } from '@/design-system/lib/utils';

import { useReveal } from './useReveal';

interface RevealProps {
  children: ReactNode;
  /** Delay before the reveal, in ms — pass `index * 50` to stagger a list. */
  delay?: number;
  className?: string;
}

/**
 * Fades and lifts its content in when it scrolls into view.
 * Reduced motion is handled in CSS, so the content never flashes hidden for those visitors.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-[cubic-bezier(.16,1,.3,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        { 'translate-y-7 opacity-0': !visible, 'translate-y-0 opacity-100': visible },
        className
      )}>
      {children}
    </div>
  );
}
