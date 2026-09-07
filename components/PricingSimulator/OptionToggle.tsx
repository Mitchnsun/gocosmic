'use client';

import { cn } from '@/design-system/lib/utils';

interface OptionToggleProps {
  label: string;
  /** Short plain-language explanation shown under the label. */
  hint?: string;
  /** Pre-formatted surcharge, e.g. `+5€`. */
  price: string;
  checked: boolean;
  onChange: () => void;
  children?: React.ReactNode;
}

/** One tickable add-on row: label, plain-language hint and its monthly surcharge. */
export function OptionToggle({ label, hint, price, checked, onChange, children }: OptionToggleProps) {
  return (
    <div
      className={cn(
        'rounded-xl border transition-colors duration-200',
        checked ? 'border-aerospace/40 bg-aerospace/[0.04]' : 'border-ghost/8 bg-ghost/[0.02] hover:border-ghost/15'
      )}>
      <label className="flex cursor-pointer items-start gap-4 p-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="accent-aerospace mt-1 h-5 w-5 shrink-0 cursor-pointer"
        />
        <span className="min-w-0 flex-1">
          <span className="font-display text-ghost block text-base font-medium">{label}</span>
          {hint && <span className="text-ghost/55 mt-1 block text-sm">{hint}</span>}
        </span>
        <span
          className={cn(
            'shrink-0 font-mono text-sm tracking-wider tabular-nums',
            checked ? 'text-aerospace' : 'text-ghost/35'
          )}>
          {price}
        </span>
      </label>
      {children}
    </div>
  );
}
