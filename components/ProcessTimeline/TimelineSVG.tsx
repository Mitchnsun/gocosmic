'use client';

import { useEffect, useRef } from 'react';

interface TimelineSVGProps {
  steps: number;
  duration: number;
  reducedMotion: boolean;
}

export function TimelineSVG({ steps, duration, reducedMotion }: TimelineSVGProps) {
  const lineRef = useRef<SVGLineElement>(null);
  const totalHeight = steps * 120;

  useEffect(() => {
    const line = lineRef.current;
    if (!line || reducedMotion) return;

    line.style.strokeDasharray = String(totalHeight);
    line.style.strokeDashoffset = String(totalHeight);
    line.style.transition = `stroke-dashoffset ${duration}ms ease-out`;

    const raf = requestAnimationFrame(() => {
      line.style.strokeDashoffset = '0';
    });

    return () => cancelAnimationFrame(raf);
  }, [totalHeight, duration, reducedMotion]);

  return (
    <svg
      width="2"
      height={totalHeight}
      viewBox={`0 0 2 ${totalHeight}`}
      aria-hidden="true"
      className="text-muted absolute top-0 left-1/2 -translate-x-1/2 overflow-visible text-slate-600">
      <line
        ref={lineRef}
        x1="1"
        y1="0"
        x2="1"
        y2={totalHeight}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray={reducedMotion ? undefined : totalHeight}
        strokeDashoffset={reducedMotion ? 0 : totalHeight}
      />
    </svg>
  );
}
