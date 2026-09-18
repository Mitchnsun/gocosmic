/** Shape of the contact form payload, shared by the client form and the API route. */
export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone: string;
  company: string;
  /** Hidden anti-spam field — must stay empty. */
  honeypot: string;
}

/** Fields the visitor can fill in. */
export type ContactField = Exclude<keyof ContactPayload, 'honeypot'>;

/** Error codes returned by {@link validateContact}, mapped to translation keys. */
export type ContactErrorCode =
  | 'name_length'
  | 'email_invalid'
  | 'subject_length'
  | 'message_length'
  | 'phone_invalid'
  | 'company_length';

export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>;

/** Fields in the order they appear in the form, so the first invalid one can
 *  be focused after a failed submission. */
export const CONTACT_FIELD_ORDER: ContactField[] = ['name', 'email', 'subject', 'message', 'phone', 'company'];

/** Length boundaries enforced on both sides of the wire. */
export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  email: { min: 5, max: 254 },
  subject: { min: 5, max: 200 },
  message: { min: 10, max: 5000 },
  phone: { min: 6, max: 30 },
  company: { min: 0, max: 120 },
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_PATTERN = /^[+0-9][0-9\s().-]{5,29}$/;

/** Returns an empty payload — the initial state of the form. */
export const emptyContactPayload = (): ContactPayload => ({
  name: '',
  email: '',
  subject: '',
  message: '',
  phone: '',
  company: '',
  honeypot: '',
});

const isLengthOutside = (value: string, { min, max }: { min: number; max: number }) =>
  value.length < min || value.length > max;

/**
 * Validates a contact payload. Required fields are `name`, `email` and
 * `message`; `subject`, `phone` and `company` are only checked when filled.
 *
 * @param payload - Raw values, trimmed internally before checking.
 * @returns A map of field to error code — empty when the payload is valid.
 */
export const validateContact = (payload: ContactPayload): ContactErrors => {
  const errors: ContactErrors = {};
  const name = payload.name.trim();
  const email = payload.email.trim();
  const subject = payload.subject.trim();
  const message = payload.message.trim();
  const phone = payload.phone.trim();
  const company = payload.company.trim();

  if (isLengthOutside(name, CONTACT_LIMITS.name)) errors.name = 'name_length';
  if (!EMAIL_PATTERN.test(email) || email.length > CONTACT_LIMITS.email.max) errors.email = 'email_invalid';
  if (subject.length > 0 && isLengthOutside(subject, CONTACT_LIMITS.subject)) errors.subject = 'subject_length';
  if (isLengthOutside(message, CONTACT_LIMITS.message)) errors.message = 'message_length';
  if (phone.length > 0 && !PHONE_PATTERN.test(phone)) errors.phone = 'phone_invalid';
  if (company.length > CONTACT_LIMITS.company.max) errors.company = 'company_length';

  return errors;
};

/** True when the payload carries no validation error. */
export const isContactPayloadValid = (payload: ContactPayload): boolean =>
  Object.keys(validateContact(payload)).length === 0;
