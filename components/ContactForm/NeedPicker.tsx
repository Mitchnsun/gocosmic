import type { ChangeEvent } from 'react';

import type { ContactNeed } from '@/lib/contact/validation';

interface NeedPickerProps {
  legend: string;
  /** Short mono hint after the legend, e.g. the "optional" marker. */
  hint?: string;
  options: { value: ContactNeed; label: string }[];
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
}

/** "What you need" chips: native radio buttons styled as pills, so the keyboard and screen readers get a real radio group. */
export const NeedPicker = ({ legend, hint, options, value, onChange, disabled = false, error }: NeedPickerProps) => (
  <fieldset className="flex flex-col gap-3" disabled={disabled} aria-describedby={error ? 'need-error' : undefined}>
    <legend className="text-ghost font-display mb-3 flex items-baseline gap-2 text-sm font-medium">
      {legend}
      {hint && <span className="text-ghost/35 text-2xs font-mono tracking-widest uppercase">{hint}</span>}
    </legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <label key={option.value} className="cursor-pointer">
          <input
            id={index === 0 ? 'need' : undefined}
            type="radio"
            name="need"
            value={option.value}
            checked={value === option.value}
            onChange={onChange}
            className="peer sr-only"
          />
          <span className="font-display border-ghost/15 text-ghost/75 hover:border-ghost/40 peer-checked:bg-aerospace peer-checked:border-aerospace peer-checked:text-void peer-focus-visible:ring-aerospace/70 inline-flex h-11 items-center rounded-full border px-4 text-sm transition-colors peer-focus-visible:ring-2">
            {option.label}
          </span>
        </label>
      ))}
    </div>
    {error && (
      <p id="need-error" className="text-aerospace text-sm">
        {error}
      </p>
    )}
  </fieldset>
);
