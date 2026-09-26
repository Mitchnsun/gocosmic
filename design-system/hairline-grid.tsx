import type { ReactNode } from 'react';

import { cn } from './lib/utils';

interface HairlineGridProps {
  children: ReactNode;
  /** `ol` when the order carries meaning, e.g. numbered reasons. */
  as?: 'ul' | 'ol';
  /** Column classes, e.g. `md:grid-cols-3`. Cells must paint their own background. */
  className?: string;
}

/**
 * Card grid separated by 1 px hairlines: the grid gap lets the container's
 * faint background show between cells, which each paint the section colour.
 */
export function HairlineGrid({ children, as: Tag = 'ul', className }: HairlineGridProps) {
  return (
    <Tag className={cn('bg-ghost/8 border-ghost/8 grid gap-px overflow-hidden rounded-[20px] border', className)}>
      {children}
    </Tag>
  );
}
