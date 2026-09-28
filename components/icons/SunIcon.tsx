import type { SVGProps } from 'react';

/** Geometric sun: a disc inside a ring. */
export default function SunIcon({ className, ...props }: Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
    </svg>
  );
}
