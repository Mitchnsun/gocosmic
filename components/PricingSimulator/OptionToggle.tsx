'use client';

import { type ReactNode, useId } from 'react';

import { CHECKBOX_CONTROL } from '@/design-system/field';
import { InfoPopover } from '@/design-system/info-popover';
import { cn } from '@/design-system/lib/utils';

import { OptionText } from './OptionText';

interface OptionToggleProps {
  label: string;
  /** Short plain-language explanation shown under the label. */
  hint?: string;
  /** Pre-formatted surcharge, e.g. `+5€`. */
  price: string;
  checked: boolean;
  onChange: () => void;
  /** Context opened from the "i" button next to the row: its accessible name and its text. */
  info?: { label: string; text: string };
  /** Commitment badge shown under the price, e.g. "1-year commitment". */
  commitment?: string;
  /** Live sentence under the row, e.g. why another option changed this one. */
  note?: string;
  /** Id of the note, when another control (a slider) is described by it too. */
  noteId?: string;
  /** Locks the tick box, when another option requires it. */
  disabled?: boolean;
  /** Smaller row, nested under a parent option. */
  nested?: boolean;
  /** Settings revealed under the row (slider, sub-options…). */
  children?: ReactNode;
}

/**
 * One tickable option: label, plain-language hint and its monthly surcharge, with an optional
 * info button. The button sits next to the `<label>`, never inside it, so opening the bubble does
 * not tick the box and its name does not leak into the checkbox's.
 */
export function OptionToggle({
  label,
  hint,
  price,
  checked,
  onChange,
  info,
  commitment,
  note,
  noteId,
  disabled = false,
  nested = false,
  children,
}: OptionToggleProps) {
  const id = useId();
  const ownNoteId = noteId ?? `${id}-note`;
  const describedBy = [hint && `${id}-hint`, `${id}-price`, commitment && `${id}-commitment`, note && ownNoteId]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      // The orange price must keep 4.5:1 on the tint: lighter in the light theme, and nested rows
      // add no second tint on top of their parent's.
      className={cn('rounded-xl border transition-colors duration-200', {
        'border-aerospace': checked,
        'bg-aerospace/[0.06] light:bg-aerospace/[0.03]': checked && !nested,
        'border-line bg-surface hover:border-line-2': !checked,
        'rounded-lg': nested,
      })}>
      <div className="flex items-start">
        <label
          className={cn('flex min-w-0 flex-1 items-start gap-4 p-4', {
            'cursor-pointer': !disabled,
            'cursor-not-allowed': disabled,
            'pr-1': info,
          })}>
          <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            aria-labelledby={`${id}-label`}
            aria-describedby={describedBy}
            className={cn(CHECKBOX_CONTROL, 'mt-1 disabled:cursor-not-allowed disabled:opacity-60')}
          />
          <OptionText
            id={id}
            label={label}
            price={price}
            hint={hint}
            commitment={commitment}
            checked={checked}
            nested={nested}
          />
        </label>
        {info && (
          <InfoPopover label={info.label} title={label} className="mt-2.5 mr-1.5">
            <p>{info.text}</p>
          </InfoPopover>
        )}
      </div>
      {/* Always displayed, even empty, so screen readers announce the sentence when it appears. */}
      <p id={ownNoteId} aria-live="polite" className={cn('text-fg-2 text-sm', { 'px-4 pb-4': note })}>
        {note}
      </p>
      {children}
    </div>
  );
}
