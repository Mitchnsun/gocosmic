import { contrastLevel } from '@/design-system/lib/contrast';
import { cn } from '@/design-system/lib/utils';

const LEVEL_LABELS = { aa: 'AA', large: 'Large only', fail: 'Fail' } as const;

/** WCAG ratio of a text token on its background, coloured by verdict. */
export function ContrastBadge({ ratio }: { ratio: number }) {
  const level = contrastLevel(ratio);

  return (
    <span
      className={cn('font-mono', {
        'text-ok': level === 'aa',
        'text-aerospace-ink': level !== 'aa',
        'font-bold': level === 'fail',
      })}>
      {/* eslint-disable-next-line security/detect-object-injection -- typed contrast level */}
      {ratio.toFixed(2)}:1 · {LEVEL_LABELS[level]}
    </span>
  );
}
