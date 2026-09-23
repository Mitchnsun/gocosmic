import type { ReactNode } from 'react';

const FooterColumnHeading = ({ id, children }: { id?: string; children: ReactNode }) => (
  <h2
    id={id}
    className="text-3xs text-ghost/45 flex items-center gap-2 font-mono font-normal tracking-[0.2em] uppercase">
    <span className="bg-aerospace h-1.5 w-1.5 rounded-full" aria-hidden="true" />
    {children}
  </h2>
);

export default FooterColumnHeading;
