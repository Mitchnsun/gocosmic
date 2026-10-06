import { cn } from '@/design-system/lib/utils';

import type { RuleCard } from './DesignSystemShowcase.types';

interface RuleCardsProps {
  cards: readonly (RuleCard & { className?: string })[];
}

/** Titled bullet cards, for the layout and voice rules. */
export function RuleCards({ cards }: RuleCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-4">
      {cards.map(({ title, items, className }) => (
        <div key={title} className={cn('bg-surface border-line flex flex-col gap-3 rounded-2xl border p-5', className)}>
          <h3 className="font-display text-fg text-lg font-semibold">{title}</h3>
          <ul className="text-fg-2 flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <li key={item} className="flex gap-2.5">
                <span className="bg-fg-3 mt-2 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
