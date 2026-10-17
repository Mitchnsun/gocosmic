'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { type ComponentType, type SVGProps, useId } from 'react';

import { CHECKBOX_CONTROL, PICKABLE_SURFACE, RADIO_CONTROL } from './field';
import { cn } from './lib/utils';

export interface Choice<V extends string> {
  value: V;
  label: string;
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
  /** Called with the answer picked, even when a radio answer is picked again. */
  onChange: (value: V) => void;
  /** Answers as large cards side by side, the control invisible over the whole card, for a question that opens a path. */
  cards?: boolean;
}

/**
 * A question and its answers as native radio buttons or check boxes: a real `fieldset` / `legend`, so the
 * keyboard and screen readers get the group for free. One answer reads as a row of 44 px surfaces, several
 * as a plain list of check boxes; cards mark the picked one with a check, not only with colour.
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
              'text-fg-2 has-checked:text-fg flex min-h-11 cursor-pointer items-center gap-3 text-sm',
              { [PICKABLE_SURFACE]: !checkbox, 'px-4 py-2': !checkbox },
              {
                // An outline, unlike a ring, stays visible in forced-colours mode.
                'group has-focus-visible:outline-aerospace-ink relative p-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2':
                  cards,
              }
            )}>
            <input
              type={type}
              name={id}
              value={choice.value}
              checked={selected.includes(choice.value)}
              onChange={() => onChange(choice.value)}
              // A radio already checked fires no change: report the click anyway.
              onClick={() => type === 'radio' && selected.includes(choice.value) && onChange(choice.value)}
              className={cn(type === 'radio' ? RADIO_CONTROL : CHECKBOX_CONTROL, {
                'absolute inset-0 h-full w-full rounded-2xl opacity-0': cards,
              })}
            />
            {choice.icon && cards && <choice.icon aria-hidden="true" className="size-6 shrink-0" />}
            <span className="font-display">{choice.label}</span>
            {cards && (
              <CheckCircleIcon
                aria-hidden="true"
                className="text-aerospace-ink ml-auto hidden size-5 shrink-0 group-has-checked:block"
              />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
