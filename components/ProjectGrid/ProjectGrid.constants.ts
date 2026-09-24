import type { CaseStudySlug } from '@/components/CaseStudy';

import type { ProjectDefinition, ProjectKind } from './ProjectGrid.types';

/** Filter pills, in display order; `all` resets the filter. */
export const PROJECT_FILTERS: Array<ProjectKind | 'all'> = ['all', 'site', 'webapp', 'mobile'];

/** Facts per case study. Card order follows `data/projects.json`. */
export const PROJECT_DEFINITIONS: Record<CaseStudySlug, ProjectDefinition> = {
  choeurdespaysdumontblanc: {
    slug: 'choeurdespaysdumontblanc',
    kind: 'site',
    year: 2025,
    cover: {
      src: '/projects/choeurdespaysdumontblanc/CPMB-logo-blanc.png',
      width: 160,
      height: 55,
      fit: 'logo',
      background: '#1E2952',
    },
  },
  'psc-supersprint': { slug: 'psc-supersprint', kind: 'webapp', year: 2026 },
  'daily-fortune': {
    slug: 'daily-fortune',
    kind: 'mobile',
    year: 2026,
    cover: {
      src: '/projects/daily-fortune/app-icon.png',
      width: 1024,
      height: 1024,
      fit: 'icon',
      background: '#0d0420',
    },
  },
  mcomperat: { slug: 'mcomperat', kind: 'site', year: 2026 },
};
