'use client';

import { useEffect, useId, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

import { CrosshairIcon } from './CrosshairIcon';
import { getStationBorderClass } from './ZoneIntervention.utils';

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

export const ZoneIntervention = ({
  label,
  availability,
  stations,
  respectReducedMotion = true,
  className,
}: ZoneInterventionProps) => {
  const headingId = useId();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!respectReducedMotion) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [respectReducedMotion]);

  return (
    <section aria-labelledby={headingId} className={cn('mx-auto w-full max-w-2xl', className)}>
      {/* Header row */}
      <div className="flex items-center gap-4">
        <p id={headingId} className="text-ghost/45 font-mono text-[11px] tracking-[0.24em] uppercase">
          {label}
        </p>
        <span className="bg-ghost/10 h-px flex-1" aria-hidden="true" />
        <div className="text-jungle flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] uppercase">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span
              className={cn('bg-jungle absolute inline-flex h-full w-full rounded-full opacity-75', {
                'animate-ping': !reducedMotion,
              })}
            />
            <span className="bg-jungle relative inline-flex h-2 w-2 rounded-full" />
          </span>
          {availability}
        </div>
      </div>

      {/* Stations grid */}
      <ul className="border-ghost/8 bg-ghost/[0.02] mt-6 grid grid-cols-1 overflow-hidden rounded-xl border sm:grid-cols-2 lg:grid-cols-4">
        {stations.map((station, index) => (
          <li
            key={station.name}
            className={cn('border-ghost/8 flex flex-col items-center gap-[7px] p-4', getStationBorderClass(index))}>
            <CrosshairIcon />
            <span className="font-display text-ghost text-base font-semibold">{station.name}</span>
            <span className="text-ghost/32 font-mono text-[9.5px] tracking-[0.14em] uppercase">{station.meta}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
