import { Chip } from '@/design-system/chip';
import { cn } from '@/design-system/lib/utils';

/** "1-year commitment" badge of what turns the subscription into 12-month periods, one size above the default chip. */
export function CommitmentBadge({ label, className }: { label: string; className?: string }) {
  return <Chip className={cn('text-xs', className)}>{label}</Chip>;
}
