import { Chip } from '@/design-system/chip';
import { cn } from '@/design-system/lib/utils';

const CARDS = [
  { number: '01', title: 'Showcase site', featured: false },
  { number: '02', title: 'Site + monthly care', featured: true },
] as const;

/** Card recipe (DESIGN_GUIDELINE.md §3.9): a regular card and a featured one, orange border at 40 %. */
export function CardGallery() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
      {CARDS.map(({ number, title, featured }) => (
        <article
          key={number}
          className={cn('flex flex-col gap-3 rounded-2xl border p-6 transition-colors', {
            'bg-surface border-line hover:bg-line': !featured,
            'border-aerospace/40 bg-aerospace/4': featured,
          })}>
          <span className="text-fg-3 text-2xs font-mono tracking-[0.16em]">{number}</span>
          <h3 className="font-display text-fg text-xl font-semibold tracking-[-0.02em]">{title}</h3>
          <ul className="text-fg-2 flex flex-col gap-2 text-sm">
            <li className="flex items-center gap-2.5">
              <span className="bg-ok h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
              Included item
            </li>
            <li className="flex items-center gap-2.5">
              <span className="bg-fg-3 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
              Optional item
            </li>
          </ul>
          <div className="flex flex-wrap gap-2">
            <Chip>Tag</Chip>
          </div>
        </article>
      ))}
    </div>
  );
}
