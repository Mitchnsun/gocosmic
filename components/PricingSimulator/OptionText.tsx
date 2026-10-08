import { Chip } from '@/design-system/chip';
import { cn } from '@/design-system/lib/utils';

interface OptionTextProps {
  /** Prefix of the ids the checkbox points at (`-label`, `-price`, `-hint`, `-commitment`). */
  id: string;
  label: string;
  price: string;
  hint?: string;
  commitment?: string;
  checked: boolean;
  nested: boolean;
}

/**
 * Text of an option row. The price sits next to the label and wraps under it on narrow screens, so
 * the hint keeps the full width; the commitment badge closes the block.
 */
export function OptionText({ id, label, price, hint, commitment, checked, nested }: OptionTextProps) {
  return (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span
          id={`${id}-label`}
          className={cn('font-display text-fg font-medium', { 'text-base': !nested, 'text-sm': nested })}>
          {label}
        </span>
        <span
          id={`${id}-price`}
          className={cn('font-mono text-sm tracking-wider tabular-nums', {
            'text-aerospace-ink': checked,
            'text-fg-3': !checked,
          })}>
          {price}
        </span>
      </span>
      {hint && (
        <span id={`${id}-hint`} className="text-fg-2 mt-1 block text-sm">
          {hint}
        </span>
      )}
      {commitment && (
        <span id={`${id}-commitment`} className="mt-2 block">
          <Chip>{commitment}</Chip>
        </span>
      )}
    </span>
  );
}
