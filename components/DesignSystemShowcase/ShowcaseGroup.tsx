import type { ReactNode } from 'react';

/** Titled group of samples inside a theme panel. */
export function ShowcaseGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-fg-3 text-2xs font-mono tracking-[0.22em] uppercase">{title}</h3>
      {children}
    </div>
  );
}
