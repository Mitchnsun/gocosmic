'use client';

import { useEffect, useId, useState } from 'react';

import { cn } from '@/design-system/lib/utils';

import { ProjectCard } from './ProjectCard';
import type { ProjectsShowcaseProps } from './ProjectsShowcase.types';

export function ProjectsShowcase({
  eyebrow,
  title,
  subtitle,
  projects,
  layout = 'list',
  staggerDelay = 150,
  animationDuration = 700,
  respectReducedMotion = true,
  displayCount,
  showLoadMore = false,
  loadMoreLabel = 'Load more',
  learnMoreLabel = 'View project',
  className,
  id,
}: ProjectsShowcaseProps) {
  const generatedId = useId();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [visibleCount, setVisibleCount] = useState(displayCount ?? projects.length);

  useEffect(() => {
    if (!respectReducedMotion) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [respectReducedMotion]);

  // Sync visibleCount when displayCount prop changes
  useEffect(() => {
    setVisibleCount(displayCount ?? projects.length);
  }, [displayCount, projects.length]);

  const visibleProjects = projects.slice(0, visibleCount);
  const hasMore = visibleCount < projects.length;

  const headingId = id ? `${id}-heading` : generatedId;

  return (
    <section id={id} aria-labelledby={title ? headingId : undefined} className={cn('w-full py-16', className)}>
      {/* Section header */}
      {(eyebrow || title || subtitle) && (
        <div className="mb-12 max-w-7xl md:px-8">
          {eyebrow && (
            <p className="text-aerospace mb-4 flex items-center gap-2 font-mono text-sm font-medium tracking-widest uppercase">
              <span className="bg-aerospace h-2 w-2 rounded-full" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          {title && (
            <h2
              id={headingId}
              className="text-ghost font-display text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              {title}
            </h2>
          )}
          {subtitle && <p className="text-ghost/55 mt-4 max-w-2xl text-lg">{subtitle}</p>}
        </div>
      )}

      {/* Project list */}
      <div className="max-w-7xl md:px-8">
        <ul
          className={cn(
            layout === 'grid' && 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
            layout === 'alternating' && 'divide-ghost/8 divide-y',
            layout === 'list' && 'divide-y-0'
          )}
          aria-labelledby={title ? headingId : undefined}
          aria-label={title ? undefined : 'Projects'}>
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              staggerDelay={staggerDelay}
              animationDuration={animationDuration}
              reducedMotion={reducedMotion}
              layout={layout}
              learnMoreLabel={learnMoreLabel}
            />
          ))}
        </ul>

        {/* Load more */}
        {showLoadMore && hasMore && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + (displayCount ?? projects.length))}
              className={cn(
                'border-ghost/15 text-ghost/55 rounded-full border px-6 py-2.5 font-mono text-sm font-medium tracking-wide',
                'hover:border-aerospace hover:text-aerospace transition-colors duration-200',
                'focus-visible:ring-aerospace focus-visible:ring-offset-void focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
              )}>
              {loadMoreLabel}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
