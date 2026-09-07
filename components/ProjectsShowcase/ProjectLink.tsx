import type { ComponentProps, ReactNode } from 'react';

import { Link } from '@/i18n/navigation';

type LocalizedHref = ComponentProps<typeof Link>['href'];

interface ProjectLinkProps {
  href: string;
  className?: string;
  'aria-label'?: string;
  children: ReactNode;
}

/** Returns true for absolute or protocol-relative URLs that open outside the current origin. */
function isExternalHref(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//');
}

/**
 * Renders a project's link, choosing between a plain external anchor and the
 * locale-aware `Link` from `@/i18n/navigation` so internal hrefs resolve to
 * their translated pathname (e.g. `/projects/...` -> `/projets/...` in fr).
 */
export function ProjectLink({ href, className, 'aria-label': ariaLabel, children }: ProjectLinkProps) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={ariaLabel}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href as LocalizedHref} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
