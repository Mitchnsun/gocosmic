import { describe, expect, it } from 'vitest';

import { CASE_STUDY_SLUGS, getCaseStudyNeighbours, PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { PROJECTS } from '@/data/projects';
import { routing } from '@/i18n/routing';

describe('case study registry', () => {
  it('follows the order declared in data/projects.ts', () => {
    expect(CASE_STUDY_SLUGS).toEqual(PROJECTS.map((project) => project.slug));
  });

  it('maps every slug to a registered route', () => {
    const registeredRoutes = Object.keys(routing.pathnames);
    for (const [slug, project] of Object.entries(PROJECTS_BY_SLUG)) {
      expect(registeredRoutes, `${slug} must point to a registered route`).toContain(project.href);
    }
  });

  it('maps every slug to its translation key', () => {
    expect(Object.entries(PROJECTS_BY_SLUG).map(([slug, project]) => [slug, project.i18nKey])).toEqual(
      PROJECTS.map((project) => [project.slug, project.i18nKey])
    );
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
