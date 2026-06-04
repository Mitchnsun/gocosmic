'use client';

import { usePrefersReducedMotion } from '@/components/HeroSection/HeroSection.hooks';
import { cn } from '@/design-system/lib/utils';

interface Station {
  name: string;
  meta: string;
}

export interface ZoneInterventionProps {
  label: string;
  availability: string;
  stations: Station[];
  respectReducedMotion?: boolean;
  className?: string;
}

const CrosshairIcon = () => (
  <svg
    width={15}
    height={15}
    viewBox="0 0 15 15"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.25}
    className="text-aerospace"
    aria-hidden="true">
    <circle cx={7.5} cy={7.5} r={3.5} />
    {/* top tick */}
    <line x1={7.5} y1={0.5} x2={7.5} y2={2.5} />
    {/* bottom tick */}
    <line x1={7.5} y1={12.5} x2={7.5} y2={14.5} />
    {/* left tick */}
    <line x1={0.5} y1={7.5} x2={2.5} y2={7.5} />
    {/* right tick */}
    <line x1={12.5} y1={7.5} x2={14.5} y2={7.5} />
  </svg>
);

export const ZoneIntervention = ({
  label,
  availability,
  stations,
  respectReducedMotion = true,
  className,
}: ZoneInterventionProps) => {
  const reducedMotion = usePrefersReducedMotion(respectReducedMotion);

  return (
    <section aria-labelledby="zone-heading" className={cn('mx-auto w-full max-w-2xl', className)}>
      {/* Header row */}
      <div className="flex items-center gap-4">
        <p id="zone-heading" className="text-ghost/45 font-mono text-[11px] tracking-[0.24em] uppercase">
          {label}
        </p>
        <span className="bg-ghost/10 h-px flex-1" aria-hidden="true" />
        <div className="text-jungle flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span
              className={cn(
                'bg-jungle absolute inline-flex h-full w-full rounded-full opacity-75',
                !reducedMotion && 'animate-ping'
              )}
            />
            <span className="bg-jungle relative inline-flex h-2 w-2 rounded-full" />
          </span>
          {availability}
        </div>
      </div>

      {/* Stations grid */}
      <ul className="border-ghost/8 bg-ghost/[0.02] mt-6 grid grid-cols-1 overflow-hidden rounded-xl border sm:grid-cols-3">
        {stations.map((station, index) => (
          <li
            key={station.name}
            className={cn('flex flex-col items-center gap-[7px] p-4', index > 0 && 'sm:border-ghost/8 sm:border-l')}>
            <CrosshairIcon />
            <span className="font-display text-ghost text-base font-semibold">{station.name}</span>
            <span className="text-ghost/32 font-mono text-[9.5px] tracking-[0.14em] uppercase">{station.meta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
