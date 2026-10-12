import type { CaseStudyProps } from './CaseStudy.types';
import type { CaseStudySlug } from './constants';
import { getCaseStudyNeighbours, PROJECTS_BY_SLUG } from './constants';

/** Localized labels of the previous / next navigation. */
interface CaseStudyNavigationLabels {
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

/**
 * Long date of a release (`YYYY-MM-DD`) in the page locale, e.g. "28 février 2026"; read in UTC so it never shifts
 * a day. English uses the British order ("28 February 2026"), like the rest of the English pages. A release known
 * only by its month (`YYYY-MM`) is written without the day, e.g. "octobre 2026".
 */
export const formatReleaseDate = (date: string, locale: string): string =>
  new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, {
    ...(date.length === 7 ? { month: 'long', year: 'numeric' } : { dateStyle: 'long' }),
    timeZone: 'UTC',
  }).format(new Date(date));

/** Translator scoped to the `projectsList` namespace. */
type ProjectsTranslator = (key: string, values?: Record<string, string | number>) => string;

/**
 * Builds the mono HUD meta line of a case study page: its year, client and kind. A project that keeps being updated
 * reads "since <creation year>" followed by the date of its latest update.
 */
export const buildCaseStudyMeta = (slug: CaseStudySlug, tList: ProjectsTranslator, locale: string): string[] => {
  const project = PROJECTS_BY_SLUG[slug];
  const dates =
    'latestRelease' in project
      ? [
          tList('since', { year: project.year }),
          tList('updated', { date: formatReleaseDate(project.latestRelease.date, locale) }),
        ]
      : [String(project.year)];
  return [...dates, tList(`items.${project.i18nKey}.client`), tList(`kinds.${project.kind}`)];
};
