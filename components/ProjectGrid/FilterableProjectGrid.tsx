'use client';

import { useTranslations } from 'next-intl';

import { ProjectFilters } from './ProjectFilters';
import { ProjectGrid } from './ProjectGrid';
import { PROJECT_FILTERS } from './ProjectGrid.constants';
import type { ProjectCardContent } from './ProjectGrid.types';
import { filterProjects, type ProjectFilter } from './ProjectGrid.utils';
import { useProjectFilter } from './useProjectFilter';

/**
 * Project grid with type filters; the result count is announced to screen readers.
 * Copy comes from the `projectsList.filters` messages, so the page must wrap it in a
 * `NextIntlClientProvider` (see docs/lessons.md).
 */
export function FilterableProjectGrid({ projects }: { projects: ProjectCardContent[] }) {
  const t = useTranslations('projectsList.filters');
  const { filter, setFilter } = useProjectFilter();
  const visible = filterProjects(projects, filter);
  const labels = Object.fromEntries(PROJECT_FILTERS.map((key) => [key, t(key)])) as Record<ProjectFilter, string>;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <ProjectFilters active={filter} labels={labels} groupLabel={t('label')} onChange={setFilter} />
        <p aria-live="polite" className="text-ghost/45 text-2xs font-mono tracking-[0.16em] uppercase">
          {t('count', { count: visible.length })}
        </p>
      </div>
      <ProjectGrid projects={visible} />
    </div>
  );
}
