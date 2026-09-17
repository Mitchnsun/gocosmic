import type { ChangeEvent } from 'react';

import { cn } from '@/design-system/lib/utils';

/** Props for a labelled contact form field. */
export interface FormFieldProps {
  /** Field name — matches the payload key. */
  name: string;
  /** Visible label. */
  label: string;
  /** Current value. */
  value: string;
  /** Change handler shared with the form hook. */
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Input type. Ignored when {@link FormFieldProps.multiline} is set. */
  type?: 'text' | 'email' | 'tel';
  /** Renders a textarea instead of an input. */
  multiline?: boolean;
  /** Rows for the textarea. Defaults to `6`. */
  rows?: number;
  /** Marks the field as required. */
  required?: boolean;
  /** Placeholder text. */
  placeholder?: string;
  /** Localized error message, displayed below the control. */
  error?: string;
  /** Maximum accepted length. */
  maxLength?: number;
  /** Autocomplete token. */
  autoComplete?: string;
  /** Additional classes for the wrapper. */
  className?: string;
}

const controlClassName =
  'bg-ghost/[0.03] border-ghost/15 text-ghost placeholder:text-ghost/35 focus:border-aerospace focus:ring-aerospace/30 w-full rounded-xl border px-4 py-3 text-base transition-colors focus:ring-2 focus:outline-none';

/**
 * Labelled input or textarea with inline validation feedback wired through
 * `aria-invalid` / `aria-describedby`.
 *
 * @component
 */
export const FormField = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
  rows = 6,
  required = false,
  placeholder,
  error,
  maxLength,
  autoComplete,
  className,
}: FormFieldProps) => {
  const errorId = `${name}-error`;
  const shared = {
    id: name,
    name,
    value,
    onChange,
    required,
    placeholder,
    maxLength,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className: cn(controlClassName, { 'border-red-400 focus:border-red-400 focus:ring-red-400/30': Boolean(error) }),
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={name} className="text-ghost font-display text-sm font-medium">
        {label}
        {required && (
          <span className="text-aerospace ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {multiline ? <textarea {...shared} rows={rows} /> : <input {...shared} type={type} />}
      {error && (
        <p id={errorId} className="text-2xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
