import type { ReactNode } from 'react';

import { cn } from '@/design-system/lib/utils';

interface SectionHeadingProps {
  /** Mono eyebrow, e.g. `[ Pour qui · 03 ]`. */
  eyebrow: string;
  /** Section title; `<em>` renders as the light italic editorial emphasis. */
  title: ReactNode;
  /** Id of the `h2`, for the section's `aria-labelledby`. */
  titleId: string;
  /** Optional supporting paragraph, 56ch max. */
  lead?: string;
  /** `h1` for a page intro, `h2` for a section. Defaults to `h2`. */
  level?: 1 | 2;
  /** Overrides the title size, e.g. for a page intro sharing its row with a form. */
  titleClassName?: string;
  className?: string;
}

/** Eyebrow → title with emphasis → lead: the rhythm every section of the site opens with. */
export function SectionHeading({
  eyebrow,
  title,
  titleId,
  lead,
  level = 2,
  titleClassName,
  className,
}: SectionHeadingProps) {
  const Heading = level === 1 ? 'h1' : 'h2';

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <p className="text-aerospace text-2xs flex items-center gap-2.5 font-mono tracking-[0.22em] uppercase">
        <span className="bg-aerospace h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        {eyebrow}
      </p>
      <Heading
        id={titleId}
        className={cn(
          'font-display text-ghost [&_em]:text-ghost/55 font-semibold text-balance [&_em]:font-light',
          // Size and line height travel together: tailwind-merge drops a `leading-*` placed before a `text-*` size.
          {
            'text-[clamp(2.25rem,6vw,5rem)] leading-[0.98] tracking-[-0.035em]': level === 1,
            'text-[clamp(1.875rem,4.2vw,3.5rem)] leading-none tracking-[-0.03em]': level === 2,
          },
          titleClassName
        )}>
        {title}
      </Heading>
      {lead && <p className="text-ghost/70 max-w-[56ch] text-base leading-relaxed text-pretty sm:text-lg">{lead}</p>}
    </div>
  );
}
