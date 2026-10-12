import { describe, expect, it } from 'vitest';

import { buildCaseStudyMeta, buildCaseStudyNavigation, formatReleaseDate } from '@/components/CaseStudy';

const labels = { previous: 'Previous project', next: 'Next project', ariaLabel: 'Case study navigation' };

describe('buildCaseStudyNavigation', () => {
  it('resolves both neighbours with their localized title and route', () => {
    const navigation = buildCaseStudyNavigation('psc-supersprint', labels, (key) => `title:${key}`);

    expect(navigation.previousLabel).toBe('Previous project');
    expect(navigation.nextLabel).toBe('Next project');
    expect(navigation.ariaLabel).toBe('Case study navigation');
    expect(navigation.previous).toEqual({ href: '/projects/coachnpulse', title: 'title:coachNPulse' });
    expect(navigation.next).toEqual({ href: '/projects/mcomperat', title: 'title:mcomperat' });
  });

  it('leaves both links out for an unknown slug', () => {
    const navigation = buildCaseStudyNavigation('unknown' as 'mcomperat', labels, (key) => key);

    expect(navigation.previous).toBeUndefined();
    expect(navigation.next).toBeUndefined();
  });
});

describe('buildCaseStudyMeta', () => {
  it('builds the year, client and kind of the project', () => {
    const tList = (key: string) => `t:${key}`;

    expect(buildCaseStudyMeta('choeurdespaysdumontblanc', tList, 'en')).toEqual([
      '2026',
      't:items.choeurDesPaysduMontBlanc.client',
      't:kinds.site',
    ]);
  });

  it('dates a project that keeps being updated since its creation and by its latest update', () => {
    const tList = (key: string, values?: Record<string, string | number>) =>
      `${key}:${Object.values(values ?? {}).join()}`;

    expect(buildCaseStudyMeta('mcomperat', tList, 'en').slice(0, 2)).toEqual(['since:2014', 'updated:May 2026']);
    expect(buildCaseStudyMeta('daily-fortune', tList, 'fr').slice(0, 2)).toEqual([
      'since:2025',
      'updated:28 février 2026',
    ]);
  });
});

describe('formatReleaseDate', () => {
  it.each([
    ['fr', '28 février 2026'],
    ['de', '28. Februar 2026'],
    ['en', '28 February 2026'],
  ])('writes the release date in full in %s', (locale, expected) => {
    expect(formatReleaseDate('2026-02-28', locale)).toBe(expected);
  });

  it('keeps the day whatever the time zone', () => {
    expect(formatReleaseDate('2026-01-01', 'fr')).toBe('1 janvier 2026');
  });

  it.each([
    ['fr', 'octobre 2026'],
    ['es', 'octubre de 2026'],
    ['en', 'October 2026'],
  ])('leaves the day out of a month-only release in %s', (locale, expected) => {
    expect(formatReleaseDate('2026-10', locale)).toBe(expected);
  });
});
