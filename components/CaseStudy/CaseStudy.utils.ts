import type { CaseStudyProps } from './CaseStudy.types';
import type { CaseStudySlug } from './constants';
import { CASE_STUDY_HREFS, CASE_STUDY_TITLE_KEYS, getCaseStudyNeighbours } from './constants';

/** Localized labels of the previous / next navigation. */
export interface CaseStudyNavigationLabels {
  previous: string;
  next: string;
  ariaLabel: string;
}

/**
 * Builds the previous / next navigation of a case study page.
 *
 * @param slug - Current case study.
 * @param labels - Localized navigation labels.
 * @param resolveTitle - Maps a `projectsList` item key to the project title.
 */
export const buildCaseStudyNavigation = (
  slug: CaseStudySlug,
  labels: CaseStudyNavigationLabels,
  resolveTitle: (titleKey: string) => string
): NonNullable<CaseStudyProps['navigation']> => {
  const { previous, next } = getCaseStudyNeighbours(slug);

  const toLink = (neighbour: CaseStudySlug | undefined) => {
    if (!neighbour) return undefined;
    // eslint-disable-next-line security/detect-object-injection
    const titleKey = CASE_STUDY_TITLE_KEYS[neighbour];
    // eslint-disable-next-line security/detect-object-injection
    return { href: CASE_STUDY_HREFS[neighbour], title: resolveTitle(titleKey) };
  };

  return {
    previousLabel: labels.previous,
    nextLabel: labels.next,
    ariaLabel: labels.ariaLabel,
    previous: toLink(previous),
    next: toLink(next),
  };
};
