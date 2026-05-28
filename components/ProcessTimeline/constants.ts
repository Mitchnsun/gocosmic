import type { TimelineStep } from './ProcessTimeline.types';

export const homepageSteps: Pick<TimelineStep, 'id' | 'color'>[] = [
  { id: 'discovery', color: 'aerospace' },
  { id: 'design', color: 'aerospace' },
  { id: 'build', color: 'aerospace' },
  { id: 'launch', color: 'aerospace' },
];
