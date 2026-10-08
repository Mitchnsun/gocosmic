import { cn } from '@/design-system/lib/utils';

/** Warm halo of the light theme (`.sun-glow`), decorative, hidden in the dark theme. Place and size it with `className`. */
export function SunGlow({ className }: { className?: string }) {
  return (
    <div
      className={cn('sun-glow light:block pointer-events-none absolute hidden aspect-square rounded-full', className)}
      aria-hidden="true"
    />
  );
}
