'use client';

interface QuoteCardProps {
  title: string;
  description: string;
  /** Short reassurance line replacing the figure this path used to display. */
  note: string;
}

/**
 * Result shown for every path that used to quote a daily rate. Custom projects
 * get a conversation rather than a number that reads as expensive out of context.
 */
export function QuoteCard({ title, description, note }: QuoteCardProps) {
  return (
    <div className="space-y-4">
      <p className="text-aerospace text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
        <span className="bg-aerospace h-1.5 w-1.5 rounded-full" aria-hidden="true" />
        {note}
      </p>
      <h3 className="font-display text-ghost text-2xl font-semibold sm:text-3xl">{title}</h3>
      <p className="text-ghost/55">{description}</p>
    </div>
  );
}
