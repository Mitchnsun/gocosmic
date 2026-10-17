'use client';

import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import { getPlanItems } from '@/components/PricingSimulator/PricingSimulator.utils';

import type { GuideAnswers, GuideStep } from './PricingGuide.types';
import { answersToChoices, getOutcome, getSteps, INITIAL_ANSWERS } from './PricingGuide.utils';

/**
 * The guide's answers, the question shown and the replace warning. A single answer picked with the
 * pointer moves on by itself; with the keyboard, the arrows only change the answer and "Next" moves on.
 * Focus follows the question shown, and comes back to the submit button when the warning is cancelled.
 */
export function usePricingGuide(plan: PlanSelection, onApply: (choices: PlanSelection) => void) {
  const [answers, setAnswers] = useState<GuideAnswers>(INITIAL_ANSWERS);
  const [step, setStep] = useState<GuideStep>('situation');
  const [confirming, setConfirming] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);
  const byPointer = useRef(false);
  /** Where focus goes once the next render is on screen; never on the first render. */
  const focusTarget = useRef<'question' | 'submit' | null>(null);

  const steps = getSteps(answers);
  // An answer only changes the questions after the current one, so the step is always found.
  const current = steps.indexOf(step);
  const last = current === steps.length - 1;
  const outcome = getOutcome(answers);
  const submittable = last && outcome === 'compose';

  useEffect(() => {
    const question = questionRef.current;
    if (focusTarget.current === 'question')
      (question?.querySelector<HTMLInputElement>('input:checked') ?? question?.querySelector('input'))?.focus();
    if (focusTarget.current === 'submit') submitRef.current?.focus();
    focusTarget.current = null;
  }, [step, confirming]);

  const goTo = (next: GuideStep | undefined) => {
    if (!next) return;
    focusTarget.current = 'question';
    setStep(next);
    setConfirming(false);
  };
  const answer = (patch: Partial<GuideAnswers>) => {
    const next = { ...answers, ...patch };
    setAnswers(next);
    setConfirming(false);
    // A pointer answer counts once: a later answer without a pointer press must not move on.
    const advance = byPointer.current && step !== 'contact';
    byPointer.current = false;
    if (advance) goTo(getSteps(next)[current + 1]);
  };
  const apply = () => {
    onApply(answersToChoices(answers));
    setConfirming(false);
  };
  const cancel = () => {
    focusTarget.current = 'submit';
    setConfirming(false);
  };
  // The answers would overwrite options ticked by hand: ask first.
  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    // Enter on an answer submits the form, whatever the step: only the last one may apply.
    if (!submittable) return;
    if (getPlanItems(plan).length > 1) setConfirming(true);
    else apply();
  };
  // Only note whether the next answer comes from a pointer on an answer, or from the keyboard.
  const notePointer = (event: { target: EventTarget }) => {
    byPointer.current = event.target instanceof Element && event.target.closest('label') !== null;
  };
  const noteKeyboard = () => {
    byPointer.current = false;
  };

  return {
    answers,
    step,
    steps,
    current,
    last,
    outcome,
    submittable,
    confirming,
    questionRef,
    submitRef,
    answer,
    goTo,
    apply,
    cancel,
    submit,
    notePointer,
    noteKeyboard,
  };
}
