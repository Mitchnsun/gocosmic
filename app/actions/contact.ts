'use server';

import type { ContactActionResult } from '@/components/ContactForm/ContactForm.types';
import type { ContactPayload } from '@/lib/contact/validation';
import { toContactPayload, validateContact } from '@/lib/contact/validation';
import { getResendClient, getSenderEmail, STUDIO_INBOX_EMAIL } from '@/lib/resend';

/** Forwards the message by email. Returns `false` unless it was really sent. */
const deliver = async (payload: ContactPayload): Promise<boolean> => {
  if (!process.env.RESEND_API_KEY?.trim()) {
    if (process.env.NODE_ENV === 'production') {
      // Never tell the visitor the message was sent when it was not: the form
      // then shows the error and its "write to us by email" fallback.
      console.error('[contact] submission refused: RESEND_API_KEY is missing');
      return false;
    }

    // Development and test sink: the whole submission is written to the server
    // log, so the form can be exercised end to end without a provider.
    console.info('[contact] no mail provider configured — submission logged locally', payload);
    return true;
  }

  const { error } = await getResendClient().emails.send({
    from: getSenderEmail(),
    to: [STUDIO_INBOX_EMAIL],
    replyTo: payload.email.trim(),
    subject: payload.subject.trim() || `Contact — ${payload.name.trim()}`,
    text: [
      `Name: ${payload.name.trim()}`,
      `Email: ${payload.email.trim()}`,
      `Phone: ${payload.phone.trim() || '—'}`,
      `Company: ${payload.company.trim() || '—'}`,
      '',
      payload.message.trim(),
    ].join('\n'),
  });

  if (error) console.error('[contact] delivery failed:', error);
  return !error;
};

/**
 * Receives a contact form submission and emails it to the studio.
 *
 * Never throws: every failure is reported through the returned result so the
 * form can render a message instead of crashing the page. Origin validation
 * and the request body cap are handled by Next.js for every Server Action
 * (see `next.config.ts` `serverActions.bodySizeLimit`).
 *
 * @param input - Raw form values, not trusted to match {@link ContactPayload}.
 */
export async function submitContactMessage(input: unknown): Promise<ContactActionResult> {
  const payload = toContactPayload(input);

  // Honeypot: silently accept so bots cannot tell they were filtered out.
  if (payload.honeypot.trim().length > 0) {
    return { status: 'success' };
  }

  if (Object.keys(validateContact(payload)).length > 0) {
    return { status: 'error' };
  }

  const delivered = await deliver(payload).catch(() => false);
  return delivered ? { status: 'success' } : { status: 'error' };
}
