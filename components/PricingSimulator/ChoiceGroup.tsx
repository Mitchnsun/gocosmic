'use client';

import { type ComponentType, type SVGProps, useId } from 'react';

import { CHECKBOX_CONTROL, RADIO_CONTROL } from '@/design-system/field';
import { cn } from '@/design-system/lib/utils';

export interface Choice<V extends string> {
  value: V;
  label: string;
  /** Short line under the label, e.g. what the answer implies. */
  hint?: string;
  /** Pictogram before the label, shown in the `cards` layout. */
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
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
  /** Answers as large cards side by side, the control invisible over the whole card, for a question that opens a path. */
  cards?: boolean;
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
  cards = false,
}: ChoiceGroupProps<V>) {
  const id = useId();
  // Several answers read as a plain list of check boxes, one under the other; one answer as pills.
  const checkbox = type === 'checkbox';

  return (
    <fieldset aria-describedby={help ? `${id}-help` : undefined} className="min-w-0">
      <legend className="font-display text-fg text-base font-medium">{legend}</legend>
      {help && (
        <p id={`${id}-help`} className="text-fg-2 mt-1 text-sm">
          {help}
        </p>
      )}
      <div
        className={cn('mt-3 gap-2', {
          'grid sm:grid-cols-3': cards,
          'flex flex-col': !cards && checkbox,
          'flex flex-wrap': !cards && !checkbox,
        })}>
        {choices.map((choice) => (
          <label
            key={choice.value}
            className={cn(
              'text-fg-2 has-checked:text-fg flex min-h-11 cursor-pointer items-center gap-3 text-sm transition-colors',
              {
                'border-line-2 hover:border-fg-3 has-checked:border-aerospace has-checked:bg-aerospace/6 light:has-checked:bg-aerospace/3 rounded-2xl border px-4 py-2':
                  !checkbox,
              },
              { 'has-focus-visible:ring-aerospace-ink relative p-4 has-focus-visible:ring-2': cards }
            )}>
            <input
              type={type}
              name={id}
              value={choice.value}
              checked={selected.includes(choice.value)}
              onChange={() => onChange(choice.value)}
              aria-describedby={choice.hint ? `${id}-${choice.value}-hint` : undefined}
              className={cn(type === 'radio' ? RADIO_CONTROL : CHECKBOX_CONTROL, {
                'absolute inset-0 h-full w-full rounded-2xl opacity-0': cards,
              })}
            />
            {choice.icon && cards && <choice.icon aria-hidden="true" className="size-6 shrink-0" />}
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
