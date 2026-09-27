import { PROJECTS } from '@/data/projects';

import { PROJECT_FILTERS } from './ProjectGrid.constants';
import type { ProjectCardContent, ProjectKind } from './ProjectGrid.types';

/** Translator scoped to the `projectsList` messages. */
interface ProjectsTranslator {
  (key: string): string;
  raw: (key: string) => unknown;
}

/** Translated cards for every registered case study, in the order of `data/projects.ts`. */
export function buildProjectCards(t: ProjectsTranslator): ProjectCardContent[] {
  return PROJECTS.map(({ slug, href, kind, year, cover, i18nKey }) => ({
    slug,
    href,
    kind,
    kindLabel: t(`kinds.${kind}`),
    title: t(`items.${i18nKey}.title`),
    year,
    client: t(`items.${i18nKey}.client`),
    description: t(`items.${i18nKey}.description`),
    tags: t.raw(`items.${i18nKey}.tags`) as string[],
    cover: cover && { ...cover, alt: t(`items.${i18nKey}.cover_alt`) },
    linkLabel: t('view_project'),
  }));
}

export type ProjectFilter = ProjectKind | 'all';

export const filterProjects = (cards: ProjectCardContent[], filter: ProjectFilter) =>
  filter === 'all' ? cards : cards.filter((card) => card.kind === filter);

/** Reads a `?type=` value, ignoring anything that is not a known filter. */
export const parseProjectFilter = (value: string | null | undefined): ProjectFilter =>
  PROJECT_FILTERS.find((filter) => filter === value) ?? 'all';
