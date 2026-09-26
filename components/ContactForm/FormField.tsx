import type { ChangeEvent } from 'react';

import { Field, FIELD_INPUT, FIELD_TEXTAREA } from '@/design-system/field';

/** Props for a labelled contact form field. */
export interface FormFieldProps {
  /** Field name — matches the payload key. */
  name: string;
  /** Visible label. */
  label: string;
  /** Short mono hint after the label, e.g. the "optional" marker. */
  hint?: string;
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
  /** Freezes the control, e.g. while a submission is in flight. */
  disabled?: boolean;
  /** Additional classes for the wrapper. */
  className?: string;
}

/**
 * Labelled input or textarea with inline validation feedback wired through
 * `aria-invalid` / `aria-describedby`.
 *
 * The control freezes while {@link FormFieldProps.disabled} is set, so an edit
 * made during a submission cannot be silently dropped by its confirmation.
 *
 * @component
 */
export const FormField = ({
  name,
  label,
  hint,
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
  disabled = false,
  className,
}: FormFieldProps) => {
  const shared = {
    id: name,
    name,
    value,
    onChange,
    required,
    placeholder,
    maxLength,
    autoComplete,
    disabled,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${name}-error` : undefined,
  };

  return (
    <Field id={name} label={label} hint={hint} required={required} error={error} className={className}>
      {multiline ? (
        <textarea {...shared} rows={rows} className={FIELD_TEXTAREA} />
      ) : (
        <input {...shared} type={type} className={FIELD_INPUT} />
      )}
    </Field>
  );
};
