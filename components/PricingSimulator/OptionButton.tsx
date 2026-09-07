'use client';

import { cn } from '@/design-system/lib/utils';

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'font-display focus-visible:ring-aerospace rounded-xl border px-5 py-3 text-left text-base font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none',
        {
          'border-aerospace bg-aerospace/10 text-ghost': selected,
          'border-ghost/8 bg-ghost/[0.02] text-ghost/55 hover:border-ghost/15 hover:text-ghost': !selected,
        }
      )}>
      {label}
    </button>
  );
}
