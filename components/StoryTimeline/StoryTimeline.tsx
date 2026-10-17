import { cn } from '@/design-system/lib/utils';

import type { StoryStep } from './StoryTimeline.types';
import { StoryTimelineStep } from './StoryTimelineStep';

interface StoryTimelineProps {
  steps: StoryStep[];
  /** Id of the heading that names the list. */
  labelledBy: string;
  className?: string;
}

/** Vertical timeline of the studio's milestones: one dot and mono date per step, joined by a hairline. */
export function StoryTimeline({ steps, labelledBy, className }: StoryTimelineProps) {
  return (
    <ol aria-labelledby={labelledBy} className={cn('flex flex-col gap-10', className)}>
      {steps.map((step, index) => (
        <StoryTimelineStep key={step.id} step={step} index={index} />
      ))}
    </ol>
  );
}
