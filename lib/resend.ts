import { Resend } from 'resend';

/** Inbox receiving the prospect requests — same address as the pricing and contact pages. */
export const FREE_MOCKUP_TO_EMAIL = 'prospect@gocosmic.dev';

/**
 * Sender address. It must be a domain verified in the Resend dashboard,
 * otherwise Resend rejects the request.
 */
export const FREE_MOCKUP_FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'Go Cosmic <noreply@gocosmic.dev>';

let client: Resend | undefined;

/**
 * Lazily instantiates the Resend client so a missing `RESEND_API_KEY` fails at
 * call time (with an explicit message) rather than at build time.
 *
 * @throws {Error} when `RESEND_API_KEY` is not set.
 */
export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not set: cannot send the free mockup request email.');
  }

  client ??= new Resend(apiKey);

  return client;
}

/** Test-only helper: drops the memoised client so a new API key can be picked up. */
export function resetResendClient(): void {
  client = undefined;
}
