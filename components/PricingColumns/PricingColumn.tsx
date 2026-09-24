import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { cn } from '@/design-system/lib/utils';
import { ghostPill, primaryPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

import type { PricingColumnContent } from './PricingColumns.types';

interface PricingColumnProps {
  column: PricingColumnContent;
  /** The highlighted column gets the orange frame, green "included" dots and the primary pill. */
  highlighted?: boolean;
}

export function PricingColumn({ column, highlighted = false }: PricingColumnProps) {
  return (
    <article
      className={cn('relative flex flex-col gap-5 overflow-hidden rounded-3xl border p-[clamp(1.5rem,3vw,2.5rem)]', {
        'border-aerospace/40 bg-aerospace/[0.04]': highlighted,
        'border-ghost/10 bg-ghost/[0.02]': !highlighted,
      })}>
      {highlighted && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-2/5 -right-1/5 aspect-square w-3/5 rounded-full bg-[radial-gradient(circle,rgb(255_79_0/0.18),transparent_60%)]"
        />
      )}
      <p
        className={cn('text-3xs font-mono tracking-[0.22em] uppercase', {
          'text-aerospace': highlighted,
          'text-ghost/45': !highlighted,
        })}>
        {column.label}
      </p>
      <p className="font-display text-[clamp(2.5rem,4.5vw,3.75rem)] leading-none font-semibold tracking-[-0.03em]">
        {column.price}
        {column.period && (
          <span className="text-ghost/55 ml-1 text-lg font-normal tracking-normal">{column.period}</span>
        )}
      </p>
      <p className="text-ghost/70 leading-relaxed">{column.description}</p>
      <ul className="flex flex-col gap-2.5 text-[15px]">
        {column.features.map((feature) => (
          <li key={feature} className="flex items-baseline gap-2.5">
            <span
              aria-hidden="true"
              className={cn('h-1.5 w-1.5 shrink-0 -translate-y-0.5 rounded-full', {
                'bg-jungle': highlighted,
                'bg-ghost/40': !highlighted,
              })}
            />
            {feature}
          </li>
        ))}
      </ul>
      <Link href={column.cta.href} className={cn(highlighted ? primaryPill() : ghostPill(), 'relative mt-auto w-fit')}>
        {column.cta.text}
        {highlighted && <ArrowRightIcon className="size-4" aria-hidden="true" />}
      </Link>
    </article>
  );
}
