import projectsData from '@/data/projects.json';

import type { LocalizedHref } from './CaseStudy.types';

/** Localized route of each case study, as declared in `i18n/routing.ts`.
 *  A project is only shown once it has an entry here. */
export const CASE_STUDY_HREFS = {
  'daily-fortune': '/projects/daily-fortune',
  mcomperat: '/projects/mcomperat',
  'psc-supersprint': '/projects/psc-supersprint',
  choeurdespaysdumontblanc: '/projects/choeurdespaysdumontblanc',
} as const satisfies Record<string, LocalizedHref>;

export type CaseStudySlug = keyof typeof CASE_STUDY_HREFS;

const isCaseStudySlug = (id: string): id is CaseStudySlug => id in CASE_STUDY_HREFS;

/** Registered case studies, in the order declared by `data/projects.json`. */
export const CASE_STUDY_SLUGS: CaseStudySlug[] = projectsData
  .map((project) => project.id)
  .filter((id): id is CaseStudySlug => isCaseStudySlug(id));

/** Translation key of each case study inside the `projectsList.items` namespace. */
export const CASE_STUDY_TITLE_KEYS: Record<CaseStudySlug, string> = Object.fromEntries(
  projectsData.filter((project) => isCaseStudySlug(project.id)).map((project) => [project.id, project.i18nKey])
) as Record<CaseStudySlug, string>;

/** Neighbouring case studies of `slug`, wrapping around the list. */
export const getCaseStudyNeighbours = (slug: CaseStudySlug) => {
  const index = CASE_STUDY_SLUGS.indexOf(slug);
  const count = CASE_STUDY_SLUGS.length;
  if (index === -1 || count < 2) return { previous: undefined, next: undefined };

  return {
    previous: CASE_STUDY_SLUGS[(index - 1 + count) % count],
    next: CASE_STUDY_SLUGS[(index + 1) % count],
  };
};
