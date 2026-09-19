import { describe, expect, it } from 'vitest';

import {
  CASE_STUDY_HREFS,
  CASE_STUDY_SLUGS,
  CASE_STUDY_TITLE_KEYS,
  getCaseStudyNeighbours,
} from '@/components/CaseStudy';
import projectsData from '@/data/projects.json';
import { routing } from '@/i18n/routing';

describe('case study registry', () => {
  it('follows the order declared in data/projects.json', () => {
    expect(CASE_STUDY_SLUGS).toEqual(projectsData.map((project) => project.id));
  });

  it('maps every slug to a registered route', () => {
    const registeredRoutes = Object.keys(routing.pathnames);
    for (const [slug, href] of Object.entries(CASE_STUDY_HREFS)) {
      expect(registeredRoutes, `${slug} must point to a registered route`).toContain(href);
    }
  });

  it('maps every slug to its translation key', () => {
    expect(Object.entries(CASE_STUDY_TITLE_KEYS)).toEqual(projectsData.map((project) => [project.id, project.i18nKey]));
  });
});

describe('getCaseStudyNeighbours', () => {
  it('wraps around the list', () => {
    const first = CASE_STUDY_SLUGS[0]!;
    const last = CASE_STUDY_SLUGS[CASE_STUDY_SLUGS.length - 1]!;

    expect(getCaseStudyNeighbours(first)).toEqual({ previous: last, next: CASE_STUDY_SLUGS[1] });
    expect(getCaseStudyNeighbours(last).next).toBe(first);
  });

  it('returns no neighbour for an unknown slug', () => {
    expect(getCaseStudyNeighbours('unknown' as (typeof CASE_STUDY_SLUGS)[number])).toEqual({
      previous: undefined,
      next: undefined,
    });
  });
});
