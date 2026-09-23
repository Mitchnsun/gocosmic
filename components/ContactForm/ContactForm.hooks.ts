'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

import { submitContactMessage } from '@/app/actions/contact';
import type { ContactErrors, ContactField, ContactPayload } from '@/lib/contact/validation';
import { CONTACT_FIELD_ORDER, emptyContactPayload, validateContact } from '@/lib/contact/validation';
import { isRetryLaterError } from '@/lib/serverActionError';

import type { ContactFormErrorCode, ContactFormStatus } from './ContactForm.types';
import { hasReachedSubmissionLimit, recordSubmission } from './ContactForm.utils';

interface UseContactFormOptions {
  /** Called once the submission succeeded. */
  onSuccess?: () => void;
}

/**
 * Owns the contact form state: field values, per-field validation errors,
 * submission status, client-side rate limiting and the Server Action call.
 */
export const useContactForm = ({ onSuccess }: UseContactFormOptions) => {
  const [values, setValues] = useState<ContactPayload>(emptyContactPayload);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>('idle');
  const [formError, setFormError] = useState<ContactFormErrorCode | null>(null);
  /** Identifies the in-flight submission: a reset invalidates it so a late
   *  response cannot undo the visitor's action. */
  const requestIdRef = useRef(0);
  /** Guards against a second submit while one is already in flight — a Server
   *  Action call cannot be aborted the way a `fetch` request can. */
  const inFlightRef = useRef(false);
  /** Field to focus after a failed submission. The nonce makes two failures on
   *  the same field distinct, so the focus effect runs again. */
  const [invalidFocus, setInvalidFocus] = useState<{ field: ContactField; nonce: number } | null>(null);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name as ContactField];
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setInvalidFocus(null);
    requestIdRef.current += 1;
    inFlightRef.current = false;
    setValues(emptyContactPayload());
    setErrors({});
    setFormError(null);
    setStatus('idle');
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // A second submit while the first is in flight would deliver twice.
      if (inFlightRef.current) return;
      setFormError(null);

      const nextErrors = validateContact(values);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setStatus('error');
        // Without this the submission looks like it did nothing: the form is
        // noValidate, so the browser announces no error of its own.
        const firstInvalid = CONTACT_FIELD_ORDER.find((field) =>
          Object.prototype.hasOwnProperty.call(nextErrors, field)
        );
        if (firstInvalid) setInvalidFocus({ field: firstInvalid, nonce: Date.now() });
        return;
      }

      if (hasReachedSubmissionLimit()) {
        setFormError('rate_limited');
        setStatus('error');
        return;
      }

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      inFlightRef.current = true;
      /** True once the visitor reset or resubmitted: the response is stale. */
      const isStale = () => requestIdRef.current !== requestId;

      setStatus('submitting');
      let delivered = false;
      try {
        const result = await submitContactMessage(values);

        if (isStale()) return;

        if (result.status === 'error') {
          setFormError('server');
          setStatus('error');
          return;
        }

        recordSubmission();
        setStatus('success');
        delivered = true;
      } catch (error) {
        if (isStale()) return;
        setFormError(isRetryLaterError(error) ? 'retry_later' : 'network');
        setStatus('error');
      } finally {
        if (!isStale()) inFlightRef.current = false;
      }

      // Outside the request try/catch on purpose: a consumer callback that
      // throws must not turn a delivered message into a network error the
      // visitor would retry.
      if (!delivered) return;
      try {
        onSuccess?.();
      } catch (error) {
        console.error('[contact] the onSuccess callback threw after a delivered message', error);
      }
    },
    [onSuccess, values]
  );

  return { values, errors, status, formError, invalidFocus, handleChange, handleSubmit, reset };
};
