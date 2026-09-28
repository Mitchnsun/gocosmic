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
          'border-line-2 text-fg-2': variant === 'default',
          'border-ok/50 text-ok': variant === 'jungle',
        },
        className
      )}>
      {children}
    </span>
  );
}
