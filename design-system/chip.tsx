import type { ReactNode } from 'react';

import { cn } from './lib/utils';

interface ChipProps {
  children: ReactNode;
  /** `jungle` marks what is included; `default` is a neutral tag. */
  variant?: 'default' | 'jungle';
  className?: string;
}

/** Small bordered mono tag: project tags, service keywords, "included" badges. */
export function Chip({ children, variant = 'default', className }: ChipProps) {
  return (
    <span
      className={cn(
        'text-3xs inline-flex items-center rounded-full border px-2.5 py-1 font-mono tracking-[0.12em] uppercase',
        {
          'border-ghost/15 text-ghost/60': variant === 'default',
          'border-jungle/50 text-jungle': variant === 'jungle',
        },
        className
      )}>
      {children}
    </span>
  );
}
