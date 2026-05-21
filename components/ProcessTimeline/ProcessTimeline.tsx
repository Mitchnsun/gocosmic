'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

import type { ProcessTimelineProps } from './ProcessTimeline.types';
import { TimelineStepItem } from './TimelineStep';
import { TimelineSVG } from './TimelineSVG';

export function ProcessTimeline({
  title,
  subtitle,
  eyebrow,
  steps,
  layout = 'horizontal',
  staggerDelay = 200,
  animationDuration = 1000,
  pathDuration = 2000,
  respectReducedMotion = true,
  showDescription = true,
  className,
  id,
}: ProcessTimelineProps) {
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
    <section
      id={id}
      aria-labelledby={title ? `${id ?? 'process-timeline'}-heading` : undefined}
      className={cn('w-full py-16', className)}>
      {/* Header */}
      {(eyebrow || title || subtitle) && (
        <div className="mb-12 max-w-7xl px-4 md:px-8">
          {eyebrow && (
            <p className="text-aerospace mb-4 flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase">
              <span className="bg-aerospace h-2 w-2 rounded-full" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              id={`${id ?? 'process-timeline'}-heading`}
              className="text-ghost text-4xl font-extrabold sm:text-5xl lg:text-6xl"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
          {subtitle && <p className="mt-4 max-w-2xl text-lg text-slate-400">{subtitle}</p>}
        </div>
      )}

      {/* Timeline content */}
      {layout === 'vertical' ? (
        <div className="relative max-w-7xl px-4 md:px-8">
          <TimelineSVG steps={steps.length} duration={pathDuration} reducedMotion={reducedMotion} />
          <ol
            aria-label={title ?? 'Process timeline'}
            className="relative pl-8"
            style={{ animationDuration: `${animationDuration}ms` }}>
            {steps.map((step, index) => (
              <TimelineStepItem
                key={step.id}
                step={step}
                index={index}
                staggerDelay={staggerDelay}
                reducedMotion={reducedMotion}
                showDescription={showDescription}
                layout="vertical"
              />
            ))}
          </ol>
        </div>
      ) : layout === 'compact' ? (
        <div className="max-w-7xl px-4 md:px-8">
          <ol aria-label={title ?? 'Process timeline'}>
            {steps.map((step, index) => (
              <TimelineStepItem
                key={step.id}
                step={step}
                index={index}
                staggerDelay={staggerDelay}
                reducedMotion={reducedMotion}
                showDescription={showDescription}
                layout="compact"
              />
            ))}
          </ol>
        </div>
      ) : (
        /* horizontal layout */
        <div className="max-w-7xl px-4 md:px-8">
          <ol aria-label={title ?? 'Process timeline'} className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <TimelineStepItem
                key={step.id}
                step={step}
                index={index}
                staggerDelay={staggerDelay}
                reducedMotion={reducedMotion}
                showDescription={showDescription}
                layout="horizontal"
              />
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
