'use client';

import { useEffect, useRef } from 'react';

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

function getLabelColor(color: NonNullable<TimelineStep['color']>): string {
  if (color === 'aerospace') return colorMap.aerospace;
  if (color === 'royal') return colorMap.royal;
  if (color === 'jungle') return colorMap.jungle;
  return colorMap.default;
}

function getDotColor(color: NonNullable<TimelineStep['color']>): string {
  if (color === 'aerospace') return dotColorMap.aerospace;
  if (color === 'royal') return dotColorMap.royal;
  if (color === 'jungle') return dotColorMap.jungle;
  return dotColorMap.default;
}

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
  const color = step.color ?? 'default';
  const labelColor = getLabelColor(color);
  const dotColor = getDotColor(color);
  const delay = reducedMotion ? 0 : index * staggerDelay;

  useEffect(() => {
    const el = stepRef.current;
    if (!el) return;

    if (reducedMotion) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => {
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
    return () => observer.disconnect();
  }, [delay, reducedMotion, layout]);

  if (layout === 'vertical') {
    return (
      <div className="relative flex gap-8" role="listitem">
        {/* Dot */}
        <div className="relative z-10 flex shrink-0 flex-col items-center">
          <div
            data-testid={`dot-${step.id}`}
            className={`h-3 w-3 rounded-full border-2 border-slate-700 ${dotColor} timeline-dot`}
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
          className={`timeline-dot z-10 h-3 w-3 shrink-0 rounded-full ${dotColor}`}
          aria-hidden="true"
          style={{ animationDelay: `${delay}ms` }}
        />
        <div
          className="h-px flex-1 origin-left bg-slate-600"
          aria-hidden="true"
          style={{
            transform: reducedMotion ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform ${reducedMotion ? 0 : 600}ms ease-out`,
            transitionDelay: `${delay}ms`,
          }}
          ref={(el) => {
            if (!el || reducedMotion) return;
            const observer = new IntersectionObserver(
              (entries) => {
                for (const entry of entries) {
                  if (entry.isIntersecting) {
                    setTimeout(() => {
                      el.style.transform = 'scaleX(1)';
                    }, delay);
                    observer.unobserve(el);
                  }
                }
              },
              { threshold: 0.1 }
            );
            observer.observe(el);
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
