'use client';

import { useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { submitFreeMockupRequest } from '@/app/actions/free-mockup';
import { clearStoredPlanCode, readStoredPlanCode } from '@/lib/pricing/plan-storage';
import {
  type FreeMockupFieldErrors,
  type FreeMockupFieldName,
  type FreeMockupValues,
  getFieldErrors,
  hasFieldErrors,
  readFreeMockupField,
} from '@/lib/validation/free-mockup.schema';

import type { FreeMockupFormState } from './FreeMockupForm.types';
import { EMPTY_FREE_MOCKUP_VALUES, INITIAL_FREE_MOCKUP_STATE } from './FreeMockupForm.utils';

type TouchedFields = Partial<Record<FreeMockupFieldName, boolean>>;

const ALL_TOUCHED: TouchedFields = { email: true, colorPalette: true, websiteUrl: true, wishes: true };

/** Name of the invisible trap field, mirrored from the server action. */
const HONEYPOT_FIELD = 'company';

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
  const [planCode, setPlanCode] = useState<string | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState<FreeMockupFormState, FormData>(
    async (previousState, submitted) => {
      setTouched(ALL_TOUCHED);

      // The four visible fields are controlled, so React state is their source of
      // truth and the payload is rebuilt from it. React 19 resets the form once an
      // action settles, and skips re-rendering controlled inputs whose state did
      // not change: the palette radio is silently unchecked in the DOM while its
      // card still renders as selected, so submitting the DOM itself would send an
      // empty palette the visitor can see they picked. Only the honeypot, the
      // locale and the pricing plan, which no React state holds, come from the submitted form.
      const payload = new FormData();
      payload.set('email', values.email);
      payload.set('colorPalette', values.colorPalette);
      payload.set('websiteUrl', values.websiteUrl);
      payload.set('wishes', values.wishes);
      payload.set('locale', readFreeMockupField(submitted, 'locale'));
      payload.set('plan', readFreeMockupField(submitted, 'plan'));
      payload.set('company', readFreeMockupField(submitted, HONEYPOT_FIELD));

      // The flag is cleared where each answer is produced, never when an attempt
      // starts: clearing it up front would un-retire the previous banner for the
      // whole flight, and edits made while in flight predate the answer they
      // would otherwise retire.
      const clientErrors = getFieldErrors(values);
      if (hasFieldErrors(clientErrors)) {
        setHasEditedSinceSubmit(false);
        return { status: 'error', fieldErrors: clientErrors };
      }

      const result = await submitFreeMockupRequest(previousState, payload);
      setHasEditedSinceSubmit(false);

      return result;
    },
    INITIAL_FREE_MOCKUP_STATE
  );

  // The pricing simulation is read after mount: sessionStorage does not exist on
  // the server, so reading it during render would break hydration.
  useEffect(() => {
    setPlanCode(readStoredPlanCode() ?? undefined);
  }, []);

  // A sent request consumes the simulation, so a later one starts clean.
  useEffect(() => {
    if (state.status === 'success') clearStoredPlanCode();
  }, [state.status]);

  // React's post-action form reset leaves the palette radio unchecked while its
  // card still renders as selected. The payload no longer depends on the DOM, but
  // the mismatch still misleads keyboard and screen-reader users, so the picked
  // option is re-applied once the attempt settles.
  useEffect(() => {
    if (isPending || !values.colorPalette) return;

    const group = formRef.current?.elements.namedItem('colorPalette');
    if (group instanceof RadioNodeList && group.value !== values.colorPalette) {
      group.value = values.colorPalette;
    }
  }, [isPending, state, values.colorPalette]);

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
    // An attempt in flight has no result yet. `useActionState` keeps the previous
    // one until the new answer lands, which would pair "could not be sent" with a
    // button reading "Sending…" — so the banner stays silent for the flight.
    if (isPending) {
      return { status: 'idle' as const, hasInvalidFields: false };
    }

    // Only a failure is retired by a later edit. A success is terminal — the
    // form is replaced by its confirmation — so retiring it would leave an
    // empty card and swallow the one acknowledgement the visitor gets.
    const isStaleFailure = hasEditedSinceSubmit && state.status === 'error';

    return {
      status: isStaleFailure ? ('idle' as const) : state.status,
      hasInvalidFields: hasFieldErrors(state.fieldErrors ?? {}),
    };
  }, [hasEditedSinceSubmit, isPending, state.fieldErrors, state.status]);

  return { values, errors, feedback, planCode, formRef, setValue, markTouched, formAction, isPending };
}
