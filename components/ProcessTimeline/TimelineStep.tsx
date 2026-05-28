'use client';

import { useEffect, useRef } from 'react';

import { cn } from '@/design-system/lib/utils';

import type { TimelineStep } from './ProcessTimeline.types';

const colorMap: Record<NonNullable<TimelineStep['color']>, string> = {
  aerospace: 'text-aerospace',
  royal: 'text-royal',
  jungle: 'text-jungle',
  default: 'text-slate-400',
};

const dotColorMap: Record<NonNullable<TimelineStep['color']>, string> = {
  aerospace: 'bg-aerospace shadow-aerospace/40',
  royal: 'bg-royal shadow-royal/40',
  jungle: 'bg-jungle shadow-jungle/40',
  default: 'bg-slate-400 shadow-slate-400/40',
};

interface TimelineStepProps {
  step: TimelineStep;
  index: number;
  staggerDelay: number;
  reducedMotion: boolean;
  showDescription: boolean;
  layout: 'vertical' | 'horizontal' | 'compact';
}

export function TimelineStepItem({
  step,
  index,
  staggerDelay,
  reducedMotion,
  showDescription,
  layout,
}: TimelineStepProps) {
  const stepRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const color = step.color ?? 'default';
  // eslint-disable-next-line security/detect-object-injection
  const labelColor = colorMap[color];
  // eslint-disable-next-line security/detect-object-injection
  const dotColor = dotColorMap[color];
  const delay = reducedMotion ? 0 : index * staggerDelay;

  useEffect(() => {
    const el = stepRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            timer = setTimeout(() => {
              el.style.opacity = '1';
              el.style.transform = layout === 'vertical' ? 'translateX(0)' : 'translateY(0)';
            }, delay);
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, reducedMotion, layout]);

  useEffect(() => {
    const line = lineRef.current;
    if (!line || reducedMotion) return;

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            timer = setTimeout(() => {
              line.style.transform = 'scaleX(1)';
            }, delay);
            observer.unobserve(line);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(line);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delay, reducedMotion]);

  if (layout === 'vertical') {
    return (
      <div className="relative flex gap-8" role="listitem">
        {/* Dot */}
        <div className="relative z-10 flex shrink-0 flex-col items-center">
          <div
            data-testid={`dot-${step.id}`}
            className={cn('h-3 w-3 rounded-full border-2 border-slate-700', dotColor, !reducedMotion && 'timeline-dot')}
            aria-hidden="true"
            style={{ animationDelay: `${delay}ms` }}
          />
        </div>
        {/* Content */}
        <div
          ref={stepRef}
          className="pb-12"
          style={{
            opacity: reducedMotion ? 1 : 0,
            transform: reducedMotion ? 'none' : 'translateX(10px)',
            transition: `opacity 300ms ease-out, transform 300ms ease-out`,
          }}>
          <span className={`font-mono text-sm font-medium tracking-widest uppercase ${labelColor}`}>{step.label}</span>
          <h3 className="text-ghost mt-1 text-xl font-bold">{step.title}</h3>
          {showDescription && step.description && <p className="mt-2 text-sm text-slate-400">{step.description}</p>}
          {showDescription && step.features && step.features.length > 0 && (
            <ul className="mt-3 space-y-1" aria-label={`${step.title} features`}>
              {step.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <div className="flex items-center gap-4 py-3" role="listitem">
        <div
          data-testid={`dot-${step.id}`}
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColor}`}
          aria-hidden="true"
        />
        <div>
          <span className={`font-mono text-xs font-medium tracking-widest uppercase ${labelColor}`}>{step.label}</span>
          <p className="text-ghost text-sm font-semibold">{step.title}</p>
        </div>
      </div>
    );
  }

  // horizontal layout (default)
  return (
    <div className="group flex flex-col" role="listitem">
      {/* Label */}
      <span className={`font-mono text-sm font-medium tracking-widest uppercase ${labelColor}`}>{step.label}</span>
      {/* Dot + line row */}
      <div className="mt-2 flex items-center gap-0">
        <div
          data-testid={`dot-${step.id}`}
          className={cn('z-10 h-3 w-3 shrink-0 rounded-full', dotColor, !reducedMotion && 'timeline-dot')}
          aria-hidden="true"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          ref={lineRef}
          className="h-px flex-1 origin-left bg-slate-600"
          aria-hidden="true"
          style={{
            transform: reducedMotion ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform ${reducedMotion ? 0 : 600}ms ease-out`,
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      {/* Text content */}
      <div
        ref={stepRef}
        className="mt-4"
        style={{
          opacity: reducedMotion ? 1 : 0,
          transform: reducedMotion ? 'none' : 'translateY(8px)',
          transition: `opacity 300ms ease-out, transform 300ms ease-out`,
        }}>
        <h3 className="text-ghost text-xl font-bold">{step.title}</h3>
        {showDescription && step.description && <p className="mt-2 text-sm text-slate-400">{step.description}</p>}
        {showDescription && step.features && step.features.length > 0 && (
          <ul className="mt-3 space-y-1" aria-label={`${step.title} features`}>
            {step.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-slate-400">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor}`} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
