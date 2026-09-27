import { Reveal } from '@/components/Reveal';
import { cn } from '@/design-system/lib/utils';

import { ProjectCard } from './ProjectCard';
import type { ProjectCardContent } from './ProjectGrid.types';

interface ProjectGridProps {
  projects: ProjectCardContent[];
  className?: string;
}

/** Responsive grid of project cards, revealed with a 50 ms stagger. */
export function ProjectGrid({ projects, className }: ProjectGridProps) {
  return (
    <ul className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {projects.map((project, index) => (
        <li key={project.slug}>
          <Reveal delay={index * 50} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
