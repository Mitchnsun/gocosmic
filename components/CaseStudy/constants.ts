import { PROJECTS } from '@/data/projects';

/** Registered case studies, in the order declared by `data/projects.ts`. */
export const CASE_STUDY_SLUGS = PROJECTS.map((project) => project.slug);

export type CaseStudySlug = (typeof PROJECTS)[number]['slug'];

/** Facts of every registered case study, keyed by slug. */
export const PROJECTS_BY_SLUG = Object.fromEntries(PROJECTS.map((project) => [project.slug, project])) as {
  [K in CaseStudySlug]: Extract<(typeof PROJECTS)[number], { slug: K }>;
};

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
