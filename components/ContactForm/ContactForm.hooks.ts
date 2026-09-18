'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ContactErrors, ContactField, ContactPayload } from '@/lib/contact/validation';
import { CONTACT_FIELD_ORDER, emptyContactPayload, validateContact } from '@/lib/contact/validation';

import type { ContactFormErrorCode, ContactFormStatus } from './ContactForm.types';
import { hasReachedSubmissionLimit, recordSubmission } from './ContactForm.utils';

interface UseContactFormOptions {
  /** Endpoint receiving the payload. */
  endpoint: string;
  /** Called once the submission succeeded. */
  onSuccess?: () => void;
}

/**
 * Owns the contact form state: field values, per-field validation errors,
 * submission status, client-side rate limiting and the network call.
 */
export const useContactForm = ({ endpoint, onSuccess }: UseContactFormOptions) => {
  const [values, setValues] = useState<ContactPayload>(emptyContactPayload);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>('idle');
  const [formError, setFormError] = useState<ContactFormErrorCode | null>(null);
  /** Identifies the in-flight submission: a reset invalidates it so a late
   *  response cannot undo the visitor's action. */
  const requestIdRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  /** Field to focus after a failed submission. The nonce makes two failures on
   *  the same field distinct, so the focus effect runs again. */
  const [invalidFocus, setInvalidFocus] = useState<{ field: ContactField; nonce: number } | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

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
    abortRef.current?.abort();
    abortRef.current = null;
    setValues(emptyContactPayload());
    setErrors({});
    setFormError(null);
    setStatus('idle');
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      // A second submit while the first is in flight would deliver twice.
      if (abortRef.current !== null) return;
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
      const controller = new AbortController();
      abortRef.current = controller;
      /** True once the visitor reset or resubmitted: the response is stale. */
      const isStale = () => requestIdRef.current !== requestId;

      setStatus('submitting');
      let delivered = false;
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
          signal: controller.signal,
        });

        if (isStale()) return;

        if (response.status === 429) {
          setFormError('rate_limited');
          setStatus('error');
          return;
        }

        if (!response.ok) {
          setFormError('server');
          setStatus('error');
          return;
        }

        recordSubmission();
        setStatus('success');
        delivered = true;
      } catch {
        if (isStale() || controller.signal.aborted) return;
        setFormError('network');
        setStatus('error');
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
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
    [endpoint, onSuccess, values]
  );

  return { values, errors, status, formError, invalidFocus, handleChange, handleSubmit, reset };
};
