import type { AccentToken } from '@/design-system/accent';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';

/** Props for a token-accented bullet list. */
export interface AccentListProps {
  /** List entries, already localized. */
  items: string[];
  /** Optional mono label rendered above the list. */
  label?: string;
  /** Accent colour for the bullets. Defaults to `'aerospace'`. */
  accent?: AccentToken;
  /** Number of columns from the `md` breakpoint. Defaults to `1`. */
  columns?: 1 | 2;
  /** Accessible name for the list when no visible label is provided. */
  ariaLabel?: string;
  /** Additional classes for the wrapper. */
  className?: string;
}

/**
 * Bullet list with a small accent dot per entry — the default way to render
 * feature, approach and outcome lists across inner pages.
 *
 * @component
 */
export const AccentList = ({
  items,
  label,
  accent = 'aerospace',
  columns = 1,
  ariaLabel,
  className,
}: AccentListProps) => {
  const { bg } = accentClasses(accent);

  return (
    <div className={cn('w-full', className)}>
      {label && <p className="text-ghost/35 text-2xs mb-4 font-mono tracking-[0.24em] uppercase">{label}</p>}
      <ul
        aria-label={label ? undefined : ariaLabel}
        className={cn('grid gap-3', { 'md:grid-cols-2 md:gap-x-8': columns === 2 })}>
        {items.map((item) => (
          <li key={item} className="text-ghost/80 flex items-start gap-3 text-base leading-7">
            <span className={cn('mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full', bg)} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
