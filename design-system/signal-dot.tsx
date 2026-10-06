import { cn } from './lib/utils';

interface SignalDotProps {
  /** `true`: green dot with a pulsing halo (online, available); `false`: still grey dot. Defaults to `true`. */
  active?: boolean;
  className?: string;
}

/** Status dot (DESIGN_GUIDELINE.md §3.2). Decorative: the status itself is carried by visible text. */
export function SignalDot({ active = true, className }: SignalDotProps) {
  return (
    <span className={cn('relative flex h-2 w-2 shrink-0', className)} aria-hidden="true">
      {active && (
        <span className="bg-ok absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none" />
      )}
      <span className={cn('relative inline-flex h-2 w-2 rounded-full', { 'bg-ok': active, 'bg-fg-3': !active })} />
    </span>
  );
}
