import type { CaseStudyProps } from './CaseStudy.types';
import type { CaseStudySlug } from './constants';
import { getCaseStudyNeighbours, PROJECTS_BY_SLUG } from './constants';

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
    const project = PROJECTS_BY_SLUG[neighbour];
    return { href: project.href, title: resolveTitle(project.i18nKey) };
  };

  return {
    previousLabel: labels.previous,
    nextLabel: labels.next,
    ariaLabel: labels.ariaLabel,
    previous: toLink(previous),
    next: toLink(next),
  };
};

/** Translator scoped to the `projectsList` namespace. */
interface ProjectsTranslator {
  (key: string): string;
}

/** Builds the mono HUD meta line (year, client, kind) of a case study page. */
export const buildCaseStudyMeta = (slug: CaseStudySlug, tList: ProjectsTranslator): string[] => {
  // eslint-disable-next-line security/detect-object-injection
  const project = PROJECTS_BY_SLUG[slug];
  return [String(project.year), tList(`items.${project.i18nKey}.client`), tList(`kinds.${project.kind}`)];
};

/**
 * Long date of a release (`YYYY-MM-DD`) in the page locale, e.g. "28 février 2026"; read in UTC so it never shifts
 * a day. English uses the British order ("28 February 2026"), like the rest of the English pages.
 */
export const formatReleaseDate = (date: string, locale: string): string =>
  new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${date}T00:00:00Z`)
  );
