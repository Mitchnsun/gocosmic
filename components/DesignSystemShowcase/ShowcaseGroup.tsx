import type { ReactNode } from 'react';

/** Titled group of samples inside a theme panel. */
export function ShowcaseGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-fg text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}
