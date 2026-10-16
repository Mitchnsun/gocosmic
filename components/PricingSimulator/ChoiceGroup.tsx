'use client';

import { useId } from 'react';

import { CHECKBOX_CONTROL, RADIO_CONTROL } from '@/design-system/field';
import { cn } from '@/design-system/lib/utils';

export interface Choice<V extends string> {
  value: V;
  label: string;
  /** Short line under the label, e.g. what the answer implies. */
  hint?: string;
}

interface ChoiceGroupProps<V extends string> {
  legend: string;
  /** Sentence under the legend, e.g. an example. */
  help?: string;
  /** `radio` for one answer, `checkbox` for several. */
  type: 'radio' | 'checkbox';
  choices: readonly Choice<V>[];
  /** Ticked values. */
  selected: readonly V[];
  onChange: (value: V) => void;
}

/**
 * A question and its answers as native radio buttons or check boxes inside 44 px pills: a real
 * `fieldset` / `legend`, so the keyboard and screen readers get the group for free.
 */
export function ChoiceGroup<V extends string>({
  legend,
  help,
  type,
  choices,
  selected,
  onChange,
}: ChoiceGroupProps<V>) {
  const id = useId();

  return (
    <fieldset aria-describedby={help ? `${id}-help` : undefined} className="min-w-0">
      <legend className="font-display text-fg text-base font-medium">{legend}</legend>
      {help && (
        <p id={`${id}-help`} className="text-fg-2 mt-1 text-sm">
          {help}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        {choices.map((choice) => (
          <label
            key={choice.value}
            className={cn(
              'border-line-2 text-fg-2 hover:border-fg-3 flex min-h-11 cursor-pointer items-center gap-3 rounded-2xl border px-4 py-2 text-sm transition-colors',
              'has-checked:border-aerospace has-checked:bg-aerospace/[0.06] has-checked:text-fg light:has-checked:bg-aerospace/[0.03]'
            )}>
            <input
              type={type}
              name={id}
              value={choice.value}
              checked={selected.includes(choice.value)}
              onChange={() => onChange(choice.value)}
              aria-describedby={choice.hint ? `${id}-${choice.value}-hint` : undefined}
              className={type === 'radio' ? RADIO_CONTROL : CHECKBOX_CONTROL}
            />
            <span className="flex flex-col">
              <span className="font-display">{choice.label}</span>
              {choice.hint && (
                <span id={`${id}-${choice.value}-hint`} className="text-fg-2 text-xs">
                  {choice.hint}
                </span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
