'use server';

import { hasLocale } from 'next-intl';

import type { FreeMockupFormState } from '@/components/FreeMockupForm/FreeMockupForm.types';
import { routing } from '@/i18n/routing';
import { buildFreeMockupEmail } from '@/lib/free-mockup-email';
import { decodePlanCode } from '@/lib/pricing/plan-code';
import { getResendClient, getSenderEmail, STUDIO_INBOX_EMAIL } from '@/lib/resend';
import {
  freeMockupSchema,
  getFieldErrors,
  normalizeFreeMockupValues,
  readFreeMockupField,
  readFreeMockupValues,
} from '@/lib/validation/free-mockup.schema';

/** Name of the invisible trap field. Deliberately looks like a real one to bots. */
const HONEYPOT_FIELD = 'company';

/**
 * Receives a free mockup request, validates it and emails it to the studio.
 *
 * Never throws: every failure is reported through the returned state so the
 * form can render a message instead of crashing the page.
 *
 * @param _prevState - Previous `useActionState` state, unused.
 * @param formData - Submitted form payload.
 */
export async function submitFreeMockupRequest(
  _prevState: FreeMockupFormState,
  formData: FormData
): Promise<FreeMockupFormState> {
  const honeypot = readFreeMockupField(formData, HONEYPOT_FIELD);

  // A filled honeypot means a bot: drop the request without telling it so.
  if (honeypot !== '') {
    return { status: 'success' };
  }

  const values = readFreeMockupValues(formData);

  const parsed = freeMockupSchema.safeParse({ ...normalizeFreeMockupValues(values), honeypot });

  if (!parsed.success) {
    return { status: 'error', fieldErrors: getFieldErrors(values) };
  }

  const requestLocale = readFreeMockupField(formData, 'locale');
  const locale = hasLocale(routing.locales, requestLocale) ? requestLocale : routing.defaultLocale;

  // The simulation is a bonus, not a form field: an invalid code is ignored.
  const plan = decodePlanCode(readFreeMockupField(formData, 'plan')) ?? undefined;

  const { subject, text, html } = buildFreeMockupEmail({
    email: parsed.data.email,
    colorPalette: parsed.data.colorPalette,
    websiteUrl: parsed.data.websiteUrl,
    wishes: parsed.data.wishes,
    locale,
    plan,
  });

  try {
    const { error } = await getResendClient().emails.send({
      from: getSenderEmail(),
      to: [STUDIO_INBOX_EMAIL],
      replyTo: parsed.data.email,
      subject,
      text,
      html,
    });

    if (error) {
      console.error('Free mockup request could not be sent:', error);
      return { status: 'error' };
    }
  } catch (error) {
    console.error('Free mockup request could not be sent:', error);
    return { status: 'error' };
  }

  return { status: 'success' };
}
