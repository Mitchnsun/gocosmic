'use client';

import { cn } from '@/design-system/lib/utils';

import { PROJECT_FILTERS } from './ProjectGrid.constants';
import type { ProjectFilter } from './ProjectGrid.utils';

interface ProjectFiltersProps {
  active: ProjectFilter;
  labels: Record<ProjectFilter, string>;
  /** Accessible name of the pill group. */
  groupLabel: string;
  onChange: (filter: ProjectFilter) => void;
}

/** Toggle pills: exactly one is pressed at a time. */
export function ProjectFilters({ active, labels, groupLabel, onChange }: ProjectFiltersProps) {
  return (
    <div role="group" aria-label={groupLabel} className="flex flex-wrap gap-2">
      {PROJECT_FILTERS.map((filter) => {
        const pressed = filter === active;

        return (
          <button
            key={filter}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(filter)}
            className={cn(
              'font-display focus-visible:ring-aerospace/70 h-11 cursor-pointer rounded-full border px-5 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
              {
                'bg-aerospace border-aerospace text-void': pressed,
                'border-ghost/15 text-ghost/75 hover:border-ghost/40 hover:text-ghost': !pressed,
              }
            )}>
            {/* eslint-disable-next-line security/detect-object-injection -- filter comes from PROJECT_FILTERS */}
            {labels[filter]}
          </button>
        );
      })}
    </div>
  );
}
