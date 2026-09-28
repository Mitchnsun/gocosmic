import type { ReactNode } from 'react';

import { cn } from './lib/utils';

/** Input and textarea look: 48 px high, 12 px radius, orange focus ring and error border. */
export const FIELD_CONTROL =
  'bg-field border-line-2 text-fg placeholder:text-fg-3 focus:border-aerospace focus:ring-aerospace/30 aria-invalid:border-aerospace w-full rounded-xl border px-4 text-base transition-colors focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';

/**
 * Native checkbox restyled for both themes: a 20 px box whose border reaches 3:1, filled orange with a
 * dark check when ticked. It stays a real <input>, so labels, keyboard and the custom cursor keep working.
 */
export const CHECKBOX_CONTROL =
  'check-mark border-fg-3 bg-field checked:border-aerospace checked:bg-aerospace focus-visible:ring-aerospace-ink h-5 w-5 shrink-0 cursor-pointer appearance-none rounded border transition-colors focus-visible:ring-2 focus-visible:outline-none';

/** Single-line control height; textareas grow with their rows instead. */
export const FIELD_INPUT = cn(FIELD_CONTROL, 'h-12');
export const FIELD_TEXTAREA = cn(FIELD_CONTROL, 'py-3');

interface FieldProps {
  /** Id of the control, which the label points at. */
  id: string;
  label: string;
  /** Short mono hint after the label, e.g. `Facultatif`. */
  hint?: string;
  /** Adds an orange asterisk after the label. */
  required?: boolean;
  /** Error message, rendered as `{id}-error` for the control's `aria-describedby`. */
  error?: string;
  /** The control itself, styled with {@link FIELD_INPUT} or {@link FIELD_TEXTAREA}. */
  children: ReactNode;
  className?: string;
}

/** Label, control and error message: the frame shared by every form field. */
export function Field({ id, label, hint, required = false, error, children, className }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={id} className="font-display text-fg flex items-baseline gap-2 text-sm font-medium">
        <span>
          {label}
          {required && (
            <span className="text-aerospace-ink ml-1" aria-hidden="true">
              *
            </span>
          )}
        </span>
        {hint && <span className="text-fg-3 text-2xs font-mono tracking-widest uppercase">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-aerospace-ink text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
