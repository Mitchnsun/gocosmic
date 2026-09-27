import type { ProjectKind } from './ProjectGrid.types';

/** Filter pills, in display order; `all` resets the filter. */
export const PROJECT_FILTERS: Array<ProjectKind | 'all'> = ['all', 'site', 'webapp', 'mobile'];
