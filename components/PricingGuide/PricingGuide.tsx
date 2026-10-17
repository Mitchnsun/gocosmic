'use client';

import { useTranslations } from 'next-intl';
import { type SyntheticEvent, useEffect, useRef, useState } from 'react';

import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import { getPlanItems } from '@/components/PricingSimulator/PricingSimulator.utils';
import { Eyebrow } from '@/design-system/eyebrow';
import { ghostPill, primaryPill } from '@/design-system/pill';
import type { Region } from '@/lib/region';

import { GuideOutcome } from './GuideOutcome';
import { GuideQuestion } from './GuideQuestion';
import type { GuideAnswers, GuideStep } from './PricingGuide.types';
import { answersToChoices, getOutcome, getSteps, INITIAL_ANSWERS } from './PricingGuide.utils';
import { ReplaceConfirm } from './ReplaceConfirm';

interface PricingGuideProps {
  /** The simulator's normalised plan, to know whether options are already ticked. */
  plan: PlanSelection;
  region: Region;
  /** Puts the composition into the simulator. */
  onApply: (choices: PlanSelection) => void;
}

/**
 * "Help me choose": one question at a time, above a simulator that stays visible with its prices. A
 * single answer picked with the pointer moves on by itself; with the keyboard, the arrows only change
 * the answer and "Next" moves on. The answers tick the matching options, or lead to the contact page
 * for a need outside the subscription. They stay in this component and are never sent; only the
 * simulation goes along with the free mockup request.
 */
export function PricingGuide({ plan, region, onApply }: PricingGuideProps) {
  const t = useTranslations('pricing');
  const [answers, setAnswers] = useState<GuideAnswers>(INITIAL_ANSWERS);
  const [step, setStep] = useState<GuideStep>('situation');
  const [confirming, setConfirming] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);
  const byPointer = useRef(false);
  const moved = useRef(false);

  const steps = getSteps(answers);
  // An answer only changes the questions after the current one, so the step is always found.
  const current = steps.indexOf(step);
  const last = current === steps.length - 1;
  const outcome = getOutcome(answers);
  const submittable = last && outcome === 'compose';

  // Focus follows the question shown, never on the first render.
  useEffect(() => {
    const question = questionRef.current;
    if (moved.current)
      (question?.querySelector<HTMLInputElement>('input:checked') ?? question?.querySelector('input'))?.focus();
  }, [step]);

  const goTo = (next: GuideStep | undefined) => {
    if (!next) return;
    moved.current = true;
    setStep(next);
    setConfirming(false);
  };
  const answer = (patch: Partial<GuideAnswers>) => {
    const next = { ...answers, ...patch };
    setAnswers(next);
    setConfirming(false);
    // A pointer answer counts once: a later click without a pointer event must not move on.
    const advance = byPointer.current && step !== 'contact';
    byPointer.current = false;
    if (advance) goTo(getSteps(next)[current + 1]);
  };
  const apply = () => {
    onApply(answersToChoices(answers));
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

  return (
    // The listeners only note whether the answer came from a pointer or the keyboard; they add no interaction.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <form
      aria-label={t('guide.title')}
      onSubmit={submit}
      onPointerDown={(event) => {
        byPointer.current = event.target instanceof Element && event.target.closest('label') !== null;
      }}
      onKeyDown={() => {
        byPointer.current = false;
      }}
      className="border-line-2 flex flex-col gap-6 border-b pb-4 sm:pb-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <Eyebrow>{t('guide.title')}</Eyebrow>
          {steps.length > 1 && (
            <p className="text-fg-3 text-2xs font-mono tracking-[0.12em] uppercase">
              {t('guide.progress', { current: current + 1, total: steps.length })}
            </p>
          )}
        </div>
        <p className="text-fg-2 max-w-[60ch]">{t('guide.intro')}</p>
      </div>
      <div ref={questionRef}>
        <GuideQuestion
          step={step}
          answers={answers}
          onAnswer={answer}
          domain={t(`builder.options.example_domain.${region}`)}
        />
      </div>
      {last && (outcome === 'contact' || outcome === 'quote') && <GuideOutcome outcome={outcome} />}
      {confirming && <ReplaceConfirm onReplace={apply} onCancel={() => setConfirming(false)} />}
      {!confirming && (current > 0 || !last || submittable) && (
        <div className="flex flex-wrap gap-3">
          {current > 0 && (
            <button type="button" onClick={() => goTo(steps[current - 1])} className={ghostPill()}>
              {t('guide.back')}
            </button>
          )}
          {!last && (
            <button type="button" onClick={() => goTo(steps[current + 1])} className={primaryPill()}>
              {t('guide.next')}
            </button>
          )}
          {submittable && (
            <button type="submit" className={primaryPill()}>
              {t('guide.submit')}
            </button>
          )}
        </div>
      )}
    </form>
  );
}
