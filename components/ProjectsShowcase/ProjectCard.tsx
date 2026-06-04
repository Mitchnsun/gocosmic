'use client';

import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/design-system/lib/utils';

import type { Project } from './ProjectsShowcase.types';
import { useProjectsAnimation } from './useProjectsAnimation';

interface ProjectCardProps {
  project: Project;
  index: number;
  staggerDelay: number;
  animationDuration: number;
  reducedMotion: boolean;
  layout: 'list' | 'alternating' | 'grid';
  learnMoreLabel: string;
}

/* ── List layout row ───────────────────────────────────────────────────── */

function ProjectListRow({
  project,
  index,
  staggerDelay,
  animationDuration,
  reducedMotion,
  learnMoreLabel,
}: Omit<ProjectCardProps, 'layout'>) {
  const { ref, visible } = useProjectsAnimation({
    delay: reducedMotion ? 0 : index * staggerDelay,
    reducedMotion,
  });

  const isExternal = project.href.startsWith('http');
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  return (
    <li
      ref={ref as React.RefObject<HTMLLIElement>}
      data-testid={`project-card-${project.id}`}
      className="group border-ghost/8 relative border-t"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity ${reducedMotion ? 0 : animationDuration}ms ease-out, transform ${reducedMotion ? 0 : animationDuration}ms ease-out`,
      }}>
      <Link
        href={project.href}
        {...linkProps}
        aria-label={`${project.title} — ${learnMoreLabel}`}
        className={cn(
          'flex w-full items-center gap-4 px-0 py-6',
          'focus-visible:ring-aerospace focus-visible:ring-offset-void focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'sm:gap-6 lg:gap-8'
        )}>
        {/* Project index */}
        <span
          aria-hidden="true"
          className="text-ghost/35 w-8 shrink-0 font-mono text-xs font-medium tracking-widest sm:w-10">
          /{String(index + 1).padStart(2, '0')}
        </span>

        {/* Title */}
        <span
          className={cn(
            'font-display flex-1 text-xl leading-tight font-bold transition-colors duration-300 sm:text-2xl lg:text-3xl',
            project.featured ? 'text-aerospace group-hover:text-aerospace/80' : 'text-ghost group-hover:text-ghost/80'
          )}>
          {project.title}
        </span>

        {/* Tagline — hidden on small screens */}
        {project.tagline && (
          <span className="text-ghost/35 hidden w-44 shrink-0 font-mono text-xs lg:block xl:w-52">
            {project.tagline}
          </span>
        )}

        {/* Tags — hidden on small screens */}
        {project.tags && project.tags.length > 0 && (
          <span
            className="text-ghost/35 hidden w-32 shrink-0 font-mono text-xs xl:block xl:w-40"
            aria-label={`Categories: ${project.tags.join(', ')}`}>
            {project.tags.join(' · ')}
          </span>
        )}

        {/* Year */}
        {project.year !== undefined && (
          <span className="text-ghost/35 hidden shrink-0 font-mono text-xs sm:block">{project.year}</span>
        )}

        {/* Arrow */}
        <ArrowRightIcon
          className="text-ghost/35 group-hover:text-aerospace h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

/* ── Alternating layout card ────────────────────────────────────────────── */

function ProjectAlternatingCard({
  project,
  index,
  staggerDelay,
  animationDuration,
  reducedMotion,
  learnMoreLabel,
}: Omit<ProjectCardProps, 'layout'>) {
  const { ref, visible } = useProjectsAnimation({
    delay: reducedMotion ? 0 : index * staggerDelay,
    reducedMotion,
  });

  const isEven = index % 2 === 0;
  const isExternal = project.href.startsWith('http');
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  return (
    <li
      ref={ref as React.RefObject<HTMLLIElement>}
      data-testid={`project-card-${project.id}`}
      className={cn(
        'group focus-within:ring-aerospace focus-within:ring-offset-void flex flex-col gap-8 py-12 focus-within:ring-2 focus-within:ring-offset-4 focus-within:outline-none',
        'lg:flex-row lg:items-center lg:gap-12',
        !isEven && 'lg:flex-row-reverse'
      )}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity ${reducedMotion ? 0 : animationDuration}ms ease-out, transform ${reducedMotion ? 0 : animationDuration}ms ease-out`,
      }}>
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-xl lg:w-[600px] lg:shrink-0">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width ?? 600}
          height={project.image.height ?? 400}
          loading={project.featured ? 'eager' : 'lazy'}
          priority={project.featured}
          className="h-auto w-full object-cover transition-[filter,transform] duration-300 group-hover:scale-[1.02] group-hover:brightness-90"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-8">
        {project.tagline && (
          <p className="text-ghost/35 font-mono text-xs font-medium tracking-widest uppercase">{project.tagline}</p>
        )}
        <h3
          className={cn(
            'font-display text-3xl leading-tight font-bold sm:text-4xl',
            project.featured ? 'text-aerospace' : 'text-ghost'
          )}>
          {project.title}
        </h3>
        <p className="text-ghost/55 text-base">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2" aria-label="Project tags">
            {project.tags.map((tag) => (
              <li key={tag} className="border-ghost/8 text-ghost/35 rounded-full border px-3 py-1 font-mono text-xs">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={project.href}
          {...linkProps}
          className={cn(
            'text-aerospace mt-2 inline-flex w-fit items-center gap-2 text-sm font-medium',
            'underline-offset-4 hover:underline focus:underline focus:outline-none',
            'transition-all duration-300 hover:gap-3'
          )}>
          {learnMoreLabel}
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

/* ── Grid layout card ───────────────────────────────────────────────────── */

function ProjectGridCard({
  project,
  index,
  staggerDelay,
  animationDuration,
  reducedMotion,
  learnMoreLabel,
}: Omit<ProjectCardProps, 'layout'>) {
  const { ref, visible } = useProjectsAnimation({
    delay: reducedMotion ? 0 : index * staggerDelay,
    reducedMotion,
  });

  const isExternal = project.href.startsWith('http');
  const linkProps = isExternal ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};

  return (
    <li
      ref={ref as React.RefObject<HTMLLIElement>}
      data-testid={`project-card-${project.id}`}
      className="group border-ghost/8 bg-ghost/[0.02] focus-within:ring-aerospace focus-within:ring-offset-void relative flex flex-col overflow-hidden rounded-xl border focus-within:ring-2 focus-within:ring-offset-4"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: `opacity ${reducedMotion ? 0 : animationDuration}ms ease-out, transform ${reducedMotion ? 0 : animationDuration}ms ease-out`,
      }}>
      <div className="overflow-hidden">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width ?? 600}
          height={project.image.height ?? 400}
          loading={project.featured ? 'eager' : 'lazy'}
          priority={project.featured}
          className="h-48 w-full object-cover transition-[filter,transform] duration-300 group-hover:scale-[1.02] group-hover:brightness-90"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {project.tagline && (
          <p className="text-ghost/35 font-mono text-xs font-medium tracking-widest uppercase">{project.tagline}</p>
        )}
        <h3
          className={cn(
            'font-display text-xl font-bold sm:text-2xl',
            project.featured ? 'text-aerospace' : 'text-ghost'
          )}>
          {project.title}
        </h3>
        <p className="text-ghost/55 line-clamp-3 text-sm">{project.description}</p>

        {project.tags && project.tags.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2" aria-label="Project tags">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="border-ghost/8 text-ghost/35 rounded-full border px-2.5 py-0.5 font-mono text-xs">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <Link
          href={project.href}
          {...linkProps}
          aria-label={`${project.title} — ${learnMoreLabel}`}
          className={cn(
            'text-aerospace mt-3 inline-flex w-fit items-center gap-1.5 text-sm font-medium',
            'after:absolute after:inset-0',
            'underline-offset-4 hover:underline focus:underline focus:outline-none',
            'transition-all duration-300 hover:gap-2.5'
          )}>
          {learnMoreLabel}
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}

/* ── Public export ─────────────────────────────────────────────────────── */

export function ProjectCard(props: ProjectCardProps) {
  if (props.layout === 'alternating') return <ProjectAlternatingCard {...props} />;
  if (props.layout === 'grid') return <ProjectGridCard {...props} />;
  return <ProjectListRow {...props} />;
}
