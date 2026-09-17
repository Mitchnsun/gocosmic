import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

import type { CaseStudyProps } from './CaseStudy.types';

interface CaseStudyNavProps {
  /** Navigation descriptor. */
  navigation: NonNullable<CaseStudyProps['navigation']>;
}

const cardClassName =
  'border-ghost/8 bg-ghost/[0.02] hover:bg-ghost/[0.04] hover:border-ghost/15 focus-visible:ring-ghost flex flex-col gap-2 rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none';

/**
 * Previous / next case study navigation rendered at the end of the page.
 *
 * @component
 */
export const CaseStudyNav = ({ navigation }: CaseStudyNavProps) => {
  const { previous, next, previousLabel, nextLabel, ariaLabel } = navigation;

  if (!previous && !next) return null;

  return (
    <nav aria-label={ariaLabel} className="grid gap-4 md:grid-cols-2">
      {previous && (
        <Link href={previous.href} className={cardClassName}>
          <span className="text-ghost/35 text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
            <ArrowLeftIcon className="size-3" aria-hidden="true" />
            {previousLabel}
          </span>
          <span className="font-display text-ghost text-xl font-medium">{previous.title}</span>
        </Link>
      )}
      {next && (
        <Link href={next.href} className={cn(cardClassName, { 'md:col-start-2 md:items-end md:text-right': true })}>
          <span className="text-ghost/35 text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
            {nextLabel}
            <ArrowRightIcon className="size-3" aria-hidden="true" />
          </span>
          <span className="font-display text-ghost text-xl font-medium">{next.title}</span>
        </Link>
      )}
    </nav>
  );
};
