import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import type { ExternalLink } from './MoiPresident.types';

/** A text link to another site, opened in a new tab, with a 44 px target. */
export function ExternalTextLink({ label, href }: ExternalLink) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-fg hover:text-aerospace-ink focus-visible:ring-aerospace-ink inline-flex min-h-11 w-fit items-center gap-1.5 rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none">
      {label}
      <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />
    </a>
  );
}
