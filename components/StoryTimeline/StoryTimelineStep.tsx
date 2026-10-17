import { Reveal } from '@/components/Reveal';
import { cn } from '@/design-system/lib/utils';

import type { StoryStep } from './StoryTimeline.types';

interface StoryTimelineStepProps {
  step: StoryStep;
  /** Position in the list, for the 50 ms reveal stagger. */
  index: number;
}

/**
 * One milestone: a dot, the mono date, then the title and its text. A hairline runs from the dot down
 * to the next one, across the list's 40 px gap; the last step has none.
 */
export function StoryTimelineStep({ step, index }: StoryTimelineStepProps) {
  const { date, dateTime, title, description, current, action } = step;
  const dateClassName = cn('font-mono text-2xs leading-4 tracking-[0.16em] uppercase', {
    'text-aerospace-ink': current,
    'text-fg-3': !current,
  });

  return (
    <li className="before:bg-line-2 relative pl-8 before:absolute before:top-3.5 before:-bottom-[42px] before:left-[5px] before:w-px last:before:hidden sm:pl-10">
      {/* Centred on the date's first line; the in-progress step carries the timeline's one accent. */}
      <span
        aria-hidden="true"
        className={cn('absolute top-[2.5px] left-0 size-[11px] rounded-full border-2', {
          'border-aerospace bg-aerospace': current,
          'border-fg-3': !current,
        })}
      />
      <Reveal delay={index * 50} className="flex flex-col gap-2">
        {dateTime ? (
          <time dateTime={dateTime} className={dateClassName}>
            {date}
          </time>
        ) : (
          <span className={dateClassName}>{date}</span>
        )}
        <h3 className="font-display text-fg text-xl font-semibold tracking-[-0.02em] sm:text-2xl">{title}</h3>
        {description && <p className="text-fg-2 max-w-[56ch] leading-relaxed">{description}</p>}
        {action}
      </Reveal>
    </li>
  );
}
