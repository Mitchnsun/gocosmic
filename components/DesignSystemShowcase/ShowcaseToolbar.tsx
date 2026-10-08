import { cn } from '@/design-system/lib/utils';

import { MODES } from './DesignSystemShowcase.copy';
import type { ShowcaseMode } from './DesignSystemShowcase.types';

interface ShowcaseToolbarProps {
  mode: ShowcaseMode;
  onChange: (mode: ShowcaseMode) => void;
}

/** Segmented control picking the theme(s) shown, sticky under the header. */
export function ShowcaseToolbar({ mode, onChange }: ShowcaseToolbarProps) {
  return (
    <div className="border-line bg-bg/95 sticky top-[var(--header-height)] z-30 -mx-4 border-b px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div role="group" aria-label="Theme view" className="border-line-2 inline-flex rounded-full border p-1">
        {MODES.map(({ mode: value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => onChange(value)}
            className={cn(
              'text-2xs focus-visible:ring-aerospace-ink rounded-full px-4 py-2 font-mono tracking-[0.16em] uppercase transition-colors focus-visible:ring-2 focus-visible:outline-none',
              { 'bg-fg text-bg': mode === value, 'text-fg-2 hover:text-fg': mode !== value }
            )}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
