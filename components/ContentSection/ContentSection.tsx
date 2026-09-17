import type { ReactNode } from 'react';

import type { AccentToken } from '@/design-system/accent';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';

/** Props for a card-shaped content section. */
export interface ContentSectionProps {
  /** Section id — also anchors the heading (`<id>-heading`). */
  id: string;
  /** Uppercase mono eyebrow announcing the section. */
  eyebrow?: string;
  /** Mono HUD counter rendered on the opposite side of the eyebrow, e.g. `01 / 04`. */
  index?: string;
  /** Section heading, rendered as the `h2`. */
  title: ReactNode;
  /** Supporting lead paragraph. */
  lead?: ReactNode;
  /** Section body. */
  children?: ReactNode;
  /** Accent colour for the eyebrow dot and text. Defaults to `'aerospace'`. */
  accent?: AccentToken;
  /** Renders the section flat on the void instead of inside a card. Defaults to `false`. */
  flat?: boolean;
  /** Additional classes for the section wrapper. */
  className?: string;
}

/**
 * Standard inner-page section: subtle card surface on the void, mono eyebrow,
 * display heading and free-form body.
 *
 * @component
 */
export const ContentSection = ({
  id,
  eyebrow,
  index,
  title,
  lead,
  children,
  accent = 'aerospace',
  flat = false,
  className,
}: ContentSectionProps) => {
  const { text, bg } = accentClasses(accent);

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn('w-full scroll-mt-24', className)}>
      <div
        className={cn({
          'border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6 sm:p-8 lg:p-10': !flat,
        })}>
        {(eyebrow || index) && (
          <div className="mb-5 flex items-baseline justify-between gap-4">
            {eyebrow && (
              <p className={cn('text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase', text)}>
                <span className={cn('h-1.5 w-1.5 rounded-full', bg)} aria-hidden="true" />
                {eyebrow}
              </p>
            )}
            {index && <span className="text-ghost/35 text-3xs font-mono tracking-[0.2em]">{index}</span>}
          </div>
        )}
        <h2
          id={`${id}-heading`}
          className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1] font-semibold tracking-[-0.03em] text-pretty">
          {title}
        </h2>
        {lead && <p className="text-ghost/55 mt-4 max-w-3xl text-lg leading-8">{lead}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};
