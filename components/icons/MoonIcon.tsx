import type { SVGProps } from 'react';

/** Geometric moon: a ring with its left half filled. */
export default function MoonIcon({ className, ...props }: Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3.75a8.25 8.25 0 0 0 0 16.5z" fill="currentColor" />
    </svg>
  );
}
