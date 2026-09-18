'use client';

import { useActionState, useCallback, useMemo, useState } from 'react';

import { submitFreeMockupRequest } from '@/app/actions/free-mockup';
import {
  type FreeMockupFieldErrors,
  type FreeMockupFieldName,
  type FreeMockupValues,
  getFieldErrors,
  hasFieldErrors,
  readFreeMockupValues,
} from '@/lib/validation/free-mockup.schema';

import type { FreeMockupFormState } from './FreeMockupForm.types';
import { EMPTY_FREE_MOCKUP_VALUES, INITIAL_FREE_MOCKUP_STATE } from './FreeMockupForm.utils';

type TouchedFields = Partial<Record<FreeMockupFieldName, boolean>>;

const ALL_TOUCHED: TouchedFields = { email: true, colorPalette: true, websiteUrl: true, wishes: true };

/** Keeps only the errors of fields the visitor has already interacted with. */
const revealTouchedErrors = (errors: FreeMockupFieldErrors, touched: TouchedFields): FreeMockupFieldErrors => ({
  ...(touched.email && errors.email ? { email: errors.email } : {}),
  ...(touched.colorPalette && errors.colorPalette ? { colorPalette: errors.colorPalette } : {}),
  ...(touched.websiteUrl && errors.websiteUrl ? { websiteUrl: errors.websiteUrl } : {}),
  ...(touched.wishes && errors.wishes ? { wishes: errors.wishes } : {}),
});

/**
 * Owns the whole form lifecycle: controlled values, which fields may already
 * show an error, and the submission itself.
 *
 * Submission runs through a client-side guard that validates the payload before
 * any network call; the server action re-validates it independently, so the
 * guard is a UX shortcut, never the security boundary.
 */
export function useFreeMockupForm() {
  const [values, setValues] = useState<FreeMockupValues>(EMPTY_FREE_MOCKUP_VALUES);
  const [touched, setTouched] = useState<TouchedFields>({});
  const [hasEditedSinceSubmit, setHasEditedSinceSubmit] = useState(false);

  const [state, formAction, isPending] = useActionState<FreeMockupFormState, FormData>(
    async (previousState, formData) => {
      setTouched(ALL_TOUCHED);
      setHasEditedSinceSubmit(false);

      const clientErrors = getFieldErrors(readFreeMockupValues(formData));
      if (hasFieldErrors(clientErrors)) {
        return { status: 'error', fieldErrors: clientErrors };
      }

      const result = await submitFreeMockupRequest(previousState, formData);

      // Edits made while the request was in flight happened before this answer
      // existed, so they must not retire it.
      setHasEditedSinceSubmit(false);

      return result;
    },
    INITIAL_FREE_MOCKUP_STATE
  );

  const setValue = useCallback((field: FreeMockupFieldName, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setHasEditedSinceSubmit(true);
  }, []);

  const markTouched = useCallback((field: FreeMockupFieldName) => {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }, []);

  // Errors are always recomputed from the current values with the very same
  // helper the action uses, so a field clears as soon as the visitor fixes it.
  const errors = useMemo(() => revealTouchedErrors(getFieldErrors(values), touched), [touched, values]);

  // The banner describes one past submission, so its category comes from the
  // state that submission returned, never from the live values: recomputing it
  // would turn "check the highlighted fields" into "could not be sent" the
  // moment the visitor fixes them, reporting a send that never happened. Any
  // edit retires the banner altogether, since it no longer describes the form.
  const feedback = useMemo(() => {
    // Only a failure is retired by a later edit. A success is terminal — the
    // form is replaced by its confirmation — so retiring it would leave an
    // empty card and swallow the one acknowledgement the visitor gets.
    const isStaleFailure = hasEditedSinceSubmit && state.status === 'error';

    return {
      status: isStaleFailure ? ('idle' as const) : state.status,
      hasInvalidFields: hasFieldErrors(state.fieldErrors ?? {}),
    };
  }, [hasEditedSinceSubmit, state.fieldErrors, state.status]);

  return { values, errors, feedback, setValue, markTouched, state, formAction, isPending };
}
