import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { Link } from '@/i18n/navigation';

import { ProjectCover } from './ProjectCover';
import type { ProjectCardContent } from './ProjectGrid.types';

/** One project: visual, type badge, title and year, client line, summary, tags and a link to the case study. */
export function ProjectCard({ project }: { project: ProjectCardContent }) {
  return (
    <article className="group border-ghost/8 bg-ghost/[0.02] hover:bg-ghost/[0.04] has-[a:focus-visible]:ring-aerospace/70 relative flex h-full flex-col overflow-hidden rounded-[20px] border transition-colors has-[a:focus-visible]:ring-2">
      <div className="relative">
        <ProjectCover cover={project.cover} title={project.title} />
        <span className="bg-void/80 border-ghost/15 text-ghost/75 text-3xs absolute top-3 left-3 rounded-full border px-2.5 py-1 font-mono tracking-[0.12em] uppercase backdrop-blur-sm">
          {project.kindLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">
            <Link href={project.href} className="after:absolute after:inset-0 focus-visible:outline-none">
              {project.title}
            </Link>
          </h3>
          <span className="text-ghost/35 text-2xs font-mono">{project.year}</span>
        </div>
        <p className="text-ghost/45 text-3xs font-mono tracking-[0.16em] uppercase">{project.client}</p>
        <p className="text-ghost/60 text-[15px] leading-normal">{project.description}</p>
        <ul className="flex flex-wrap gap-1.5 pt-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="border-ghost/15 text-ghost/60 text-3xs rounded-full border px-2.5 py-1 font-mono tracking-[0.12em] uppercase">
              {tag}
            </li>
          ))}
        </ul>
        <span
          aria-hidden="true"
          className="font-display text-aerospace mt-auto inline-flex items-center gap-1.5 pt-2 text-[15px] font-medium">
          {project.linkLabel}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
