import type { ChangeEvent } from 'react';

import type { ContactNeed } from '@/lib/contact/validation';

interface NeedPickerProps {
  legend: string;
  options: { value: ContactNeed; label: string }[];
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

/** "What you need" chips: native radio buttons styled as pills, so the keyboard and screen readers get a real radio group. */
export const NeedPicker = ({ legend, options, value, onChange, disabled = false }: NeedPickerProps) => (
  <fieldset className="flex flex-col gap-3" disabled={disabled}>
    <legend className="text-ghost font-display mb-3 text-sm font-medium">{legend}</legend>
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
  </fieldset>
);
