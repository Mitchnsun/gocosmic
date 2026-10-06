import { cn } from '@/design-system/lib/utils';

/** Semantic colour tokens (DESIGN_GUIDELINE.md §2.1), listed statically so Tailwind generates them. */
const SWATCHES = [
  { token: 'bg', className: 'bg-bg' },
  { token: 'bg-alt', className: 'bg-bg-alt' },
  { token: 'surface', className: 'bg-surface' },
  { token: 'field', className: 'bg-field' },
  { token: 'fg', className: 'bg-fg' },
  { token: 'fg-2', className: 'bg-fg-2' },
  { token: 'fg-3', className: 'bg-fg-3' },
  { token: 'line', className: 'bg-line' },
  { token: 'line-2', className: 'bg-line-2' },
  { token: 'ok', className: 'bg-ok' },
  { token: 'aerospace', className: 'bg-aerospace' },
  { token: 'aerospace-ink', className: 'bg-aerospace-ink' },
  { token: 'royal-ink', className: 'bg-royal-ink' },
] as const;

/** One chip per semantic token, painted with the token of the surrounding theme. */
export function TokenSwatches() {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-3">
      {SWATCHES.map(({ token, className }) => (
        <li key={token} className="flex flex-col gap-2">
          <span className={cn('border-line-2 h-12 rounded-xl border', className)} aria-hidden="true" />
          <code className="text-fg-2 text-2xs font-mono">{token}</code>
        </li>
      ))}
    </ul>
  );
}
