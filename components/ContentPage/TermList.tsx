import { cn } from '@/design-system/lib/utils';

interface TermListProps {
  /** Short terms, each with its explanation. */
  items: { term: string; description: string }[];
  className?: string;
}

/** Terms and their explanation, e.g. the options of a plan, on two columns from the `md` breakpoint. */
export function TermList({ items, className }: TermListProps) {
  return (
    <dl className={cn('grid gap-x-8 gap-y-6 md:grid-cols-2', className)}>
      {items.map(({ term, description }) => (
        <div key={term} className="flex flex-col gap-1.5">
          <dt className="font-display text-fg text-lg font-semibold tracking-[-0.01em]">{term}</dt>
          <dd className="text-fg-2 leading-relaxed">{description}</dd>
        </div>
      ))}
    </dl>
  );
}
