import type { LocalizedHref } from '@/components/CaseStudy/CaseStudy.types';

/** Every non-translatable fact about a milestone of the story page; the copy lives in `messages/<locale>/story.json`. */
interface StoryMilestone {
  /** Translation key inside the `story.steps` namespace. */
  id: string;
  /** Machine-readable date (`YYYY`, `YYYY-MM` or `YYYY-MM-DD`), when the step's label is a date. */
  dateTime?: string;
  /** Still in progress: the timeline's accent marks it. */
  current?: boolean;
  /** Page the step links to, with the projects list's "View project" label. */
  href?: LocalizedHref;
}

/** The founder's path and the studio's milestones, in order, read by the story page and the files for AI agents. */
export const STORY_MILESTONES: readonly StoryMilestone[] = [
  { id: 'origins' },
  { id: 'developer', dateTime: '2012' },
  { id: 'eirl', dateTime: '2016-10-17' },
  { id: 'duingt', dateTime: '2023' },
  { id: 'goCosmic', dateTime: '2025' },
  { id: 'dailyFortune', dateTime: '2025-10', href: '/projects/daily-fortune' },
  { id: 'cosmicStudio', dateTime: '2026' },
  { id: 'cheneBougeries', dateTime: '2026-10' },
  { id: 'fer', current: true },
];
