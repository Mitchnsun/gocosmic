import type { ContactErrorCode, ContactField } from '@/lib/contact/validation';

/** Submission lifecycle of the contact form. */
export type ContactFormStatus = 'idle' | 'submitting' | 'success' | 'error';

/** Top-level failure reasons surfaced above the submit button. */
export type ContactFormErrorCode = 'rate_limited' | 'retry_later' | 'server' | 'network';

/** Visual variant of the form wrapper. */
export type ContactFormVariant = 'embedded' | 'page';

export interface ContactFormProps {
  /** Wrapper styling. `'page'` adds the card surface. Defaults to `'page'`. */
  variant?: ContactFormVariant;
  /** Called once the submission succeeded. */
  onSuccess?: () => void;
  /** Additional classes for the wrapper. */
  className?: string;
  /** Element id for the wrapper. */
  id?: string;
}

/** Result returned by the `submitContactMessage` Server Action. */
export type ContactActionResult = { status: 'success' } | { status: 'error' };

export type { ContactErrorCode, ContactField };
