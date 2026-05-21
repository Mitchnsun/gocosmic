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
        'rounded-lg border-2 px-6 py-4 text-left text-base font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none',
        selected
          ? 'border-blue-400 bg-blue-400/10 text-white'
          : 'border-slate-600 bg-slate-800 text-gray-300 hover:border-slate-400 hover:bg-slate-700 hover:text-white'
      )}>
      {label}
    </button>
  );
}
