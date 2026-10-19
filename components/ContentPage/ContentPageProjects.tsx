import type { ReactNode } from 'react';

import { ProjectGrid } from '@/components/ProjectGrid';
import type { ProjectCardContent } from '@/components/ProjectGrid/ProjectGrid.types';
import { SectionHeading } from '@/components/SectionHeading';

interface ContentPageProjectsProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  /** The case studies that back the page, each linking to its own page. */
  projects: ProjectCardContent[];
}

/** The studio's own work backing what a content page describes, as project cards. */
export function ContentPageProjects({ id, eyebrow, title, lead, projects }: ContentPageProjectsProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className="flex scroll-mt-24 flex-col gap-10">
      <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
      <ProjectGrid projects={projects} className="lg:grid-cols-2" />
    </section>
  );
}
