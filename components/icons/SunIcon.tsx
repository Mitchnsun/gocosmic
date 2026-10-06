import type { SVGProps } from 'react';

/** Geometric rising sun: a half disc over a horizon line, with three short rays. */
export default function SunIcon({ className, ...props }: Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6.5 16a5.5 5.5 0 0 1 11 0z" fill="currentColor" />
      <path
        d="M3 19.5h18M12 5v2M5.6 9.1l1.4 1.4M18.4 9.1 17 10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
