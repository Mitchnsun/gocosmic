import type { ReactNode } from 'react';

import { cn } from './lib/utils';

interface EyebrowProps {
  children: ReactNode;
  className?: string;
}

/** Mono label opening a section, after an orange signal dot, e.g. `● [ Pour qui ]`. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        'text-aerospace-ink text-2xs flex items-center gap-2.5 font-mono tracking-[0.22em] uppercase',
        className
      )}>
      <span className="bg-aerospace h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
      {children}
    </p>
  );
}
