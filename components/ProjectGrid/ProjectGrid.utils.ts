import { CASE_STUDY_HREFS, CASE_STUDY_SLUGS, CASE_STUDY_TITLE_KEYS } from '@/components/CaseStudy';

import { PROJECT_DEFINITIONS, PROJECT_FILTERS } from './ProjectGrid.constants';
import type { ProjectCardContent, ProjectKind } from './ProjectGrid.types';

/** Translator scoped to the `projectsList` messages. */
interface ProjectsTranslator {
  (key: string): string;
  raw: (key: string) => unknown;
}

/** Translated cards for every registered case study, in the order of `data/projects.json`. */
export function buildProjectCards(t: ProjectsTranslator): ProjectCardContent[] {
  // Slugs come from CASE_STUDY_SLUGS, a fixed list mirrored by the three records below.
  /* eslint-disable security/detect-object-injection */
  return CASE_STUDY_SLUGS.map((slug) => {
    const { kind, year, cover } = PROJECT_DEFINITIONS[slug];
    const key = CASE_STUDY_TITLE_KEYS[slug];

    return {
      slug,
      href: CASE_STUDY_HREFS[slug],
      kind,
      kindLabel: t(`kinds.${kind}`),
      title: t(`items.${key}.title`),
      year,
      client: t(`items.${key}.client`),
      description: t(`items.${key}.description`),
      tags: t.raw(`items.${key}.tags`) as string[],
      cover: cover && { ...cover, alt: t(`items.${key}.cover_alt`) },
      linkLabel: t('view_project'),
    };
  });
  /* eslint-enable security/detect-object-injection */
}

export type ProjectFilter = ProjectKind | 'all';

export const filterProjects = (cards: ProjectCardContent[], filter: ProjectFilter) =>
  filter === 'all' ? cards : cards.filter((card) => card.kind === filter);

/** Reads a `?type=` value, ignoring anything that is not a known filter. */
export const parseProjectFilter = (value: string | null | undefined): ProjectFilter =>
  PROJECT_FILTERS.find((filter) => filter === value) ?? 'all';
