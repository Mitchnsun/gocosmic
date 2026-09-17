import { describe, expect, it } from 'vitest';

import { buildCaseStudyNavigation } from '@/components/CaseStudy';

const labels = { previous: 'Previous project', next: 'Next project', ariaLabel: 'Case study navigation' };

describe('buildCaseStudyNavigation', () => {
  it('resolves both neighbours with their localized title and route', () => {
    const navigation = buildCaseStudyNavigation('mcomperat', labels, (key) => `title:${key}`);

    expect(navigation.previousLabel).toBe('Previous project');
    expect(navigation.nextLabel).toBe('Next project');
    expect(navigation.ariaLabel).toBe('Case study navigation');
    expect(navigation.previous).toEqual({ href: '/projects/daily-fortune', title: 'title:dailyFortune' });
    expect(navigation.next).toEqual({ href: '/projects/psc-supersprint', title: 'title:pscSupersprint' });
  });

  it('leaves both links out for an unknown slug', () => {
    const navigation = buildCaseStudyNavigation('unknown' as 'mcomperat', labels, (key) => key);

    expect(navigation.previous).toBeUndefined();
    expect(navigation.next).toBeUndefined();
  });
});
