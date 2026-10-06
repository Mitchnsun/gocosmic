import type { SVGProps } from 'react';

/** Geometric comet: a round head at the bottom left, a curved tapered tail with two thin streaks to the top right and a sparkle, all one solid fill. */
export default function CometIcon({ className, ...props }: Omit<SVGProps<SVGSVGElement>, 'children' | 'ref'>) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M4 1.5Q4 4 6.5 4Q4 4 4 6.5Q4 4 1.5 4Q4 4 4 1.5z" />
      <circle cx="8" cy="16" r="4.2" />
      <path d="M5 14.5Q7.5 7.5 21 3Q11 9.2 10.5 18.5z" />
      <path d="M4.2 12.5Q6.2 5.6 16 2.4Q7.6 7 4.2 12.5z" />
      <path d="M12.4 17.8Q15.7 11.2 21.5 6.2Q14.3 9.8 12.4 17.8z" />
    </svg>
  );
}
