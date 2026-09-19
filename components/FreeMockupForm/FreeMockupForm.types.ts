import type {
  ColorPaletteChoice,
  FreeMockupErrorCode,
  FreeMockupFieldErrors,
} from '@/lib/validation/free-mockup.schema';

/** Lifecycle of a submission, as returned by the server action. */
export type FreeMockupStatus = 'idle' | 'success' | 'error';

/**
 * State shared between the server action and `useActionState`.
 *
 * `fieldErrors` is only set when the payload failed validation server-side;
 * a transport or provider failure yields `status: 'error'` with no field error,
 * which the form renders as the generic message.
 */
export interface FreeMockupFormState {
  status: FreeMockupStatus;
  fieldErrors?: FreeMockupFieldErrors;
}

/** Props of the colour palette radio group. */
export interface ColorPaletteSelectProps {
  /** Currently selected answer, or an empty string while nothing is picked. */
  value: string;
  onChange: (value: ColorPaletteChoice) => void;
  /** Error code to display under the group, if any. */
  error?: FreeMockupErrorCode;
  /** Marks the group as touched so the error can be revealed. */
  onBlur?: () => void;
}

/** Props of the free-text wishes field and its live character counter. */
export interface WishesTextareaProps {
  value: string;
  onChange: (value: string) => void;
  error?: FreeMockupErrorCode;
  onBlur?: () => void;
}

/** Props of the shared labelled field wrapper. */
export interface FormFieldProps {
  /** `id` of the control the label points at. */
  id: string;
  label: string;
  /** Rendered next to the label for optional fields. */
  hint?: string;
  error?: string;
  children: React.ReactNode;
}
