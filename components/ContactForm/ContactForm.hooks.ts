'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import type { ContactErrors, ContactField, ContactPayload } from '@/lib/contact/validation';
import { emptyContactPayload, validateContact } from '@/lib/contact/validation';

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
        onSuccess?.();
      } catch {
        if (isStale() || controller.signal.aborted) return;
        setFormError('network');
        setStatus('error');
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [endpoint, onSuccess, values]
  );

  return { values, errors, status, formError, handleChange, handleSubmit, reset };
};
