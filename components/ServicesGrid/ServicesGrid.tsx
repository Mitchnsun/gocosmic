'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

import { ServiceCard } from './ServiceCard';
import type { ServicesGridProps } from './ServicesGrid.types';

const columnsMap: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

export function ServicesGrid({
  title,
  subtitle,
  eyebrow,
  services,
  columns = 4,
  layout = 'grid',
  staggerDelay = 100,
  animationDuration = 600,
  respectReducedMotion = true,
  className,
  id,
}: ServicesGridProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (!respectReducedMotion) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [respectReducedMotion]);

  const headingId = title ? `${id ?? 'services-grid'}-heading` : undefined;
  // eslint-disable-next-line security/detect-object-injection
  const gridColumnsClass = columnsMap[columns];

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={headingId ? undefined : 'Services'}
      className={cn('w-full py-16', className)}>
      {(eyebrow || title || subtitle) && (
        <div className="mb-12 max-w-7xl px-4 md:px-8">
          {eyebrow && (
            <p className="text-aerospace mb-4 flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase">
              <span className="bg-aerospace h-2 w-2 rounded-full" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 id={headingId} className="text-ghost text-4xl font-extrabold sm:text-5xl lg:text-6xl">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-4 max-w-2xl text-lg text-slate-400">{subtitle}</p>}
        </div>
      )}

      <div className="max-w-7xl px-4 md:px-8">
        <ul
          aria-label={title ? undefined : 'Services'}
          className={cn(
            layout === 'horizontal'
              ? 'flex flex-col gap-4 sm:flex-row sm:gap-6 sm:overflow-x-auto lg:gap-8'
              : cn('grid items-stretch gap-4 sm:gap-6 lg:gap-8', gridColumnsClass)
          )}>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              staggerDelay={staggerDelay}
              animationDuration={animationDuration}
              reducedMotion={reducedMotion}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
