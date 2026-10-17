import type { ReactNode } from 'react';

export interface StoryStep {
  id: string;
  /** Mono label: a year, a full date or a word (`Origines`, `En cours`). */
  date: string;
  /** Machine-readable date (`2016-10-17`, `2025-10`, `2012`), when the label is one. */
  dateTime?: string;
  title: string;
  description?: string;
  /** A step still in progress: its dot and label carry the timeline's one orange accent. */
  current?: boolean;
  /** Extra content after the description, e.g. a link to a case study. */
  action?: ReactNode;
}
