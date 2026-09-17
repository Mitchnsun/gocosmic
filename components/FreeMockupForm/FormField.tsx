'use client';

import type { FormFieldProps } from './FreeMockupForm.types';

/**
 * Labelled wrapper shared by the text fields: it renders the label, an optional
 * "optional" hint and the error message the control points at via
 * `aria-describedby`.
 */
export function FormField({ id, label, hint, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-display text-ghost flex items-baseline gap-2 text-sm font-medium">
        {label}
        {hint && <span className="text-ghost/35 text-2xs font-mono tracking-widest uppercase">{hint}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-aerospace text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
