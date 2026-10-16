'use client';

import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import { type SyntheticEvent, useId, useState } from 'react';

import { ChoiceGroup } from '@/components/PricingSimulator/ChoiceGroup';
import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import { getPlanItems } from '@/components/PricingSimulator/PricingSimulator.utils';
import { cn } from '@/design-system/lib/utils';
import { ghostPill, primaryPill } from '@/design-system/pill';
import type { Region } from '@/lib/region';

import { GuideOutcome } from './GuideOutcome';
import { GuideQuestions } from './GuideQuestions';
import type { ExistingPlan, GuideAnswers, Situation } from './PricingGuide.types';
import { answersToChoices, getOutcome, INITIAL_ANSWERS } from './PricingGuide.utils';
import { ReplaceConfirm } from './ReplaceConfirm';

interface PricingGuideProps {
  /** The simulator's normalised plan, to know whether options are already ticked. */
  plan: PlanSelection;
  region: Region;
  /** Puts the composition into the simulator. */
  onApply: (choices: PlanSelection) => void;
}

/**
 * "Help me choose": a short form on one page, above a simulator that stays visible with its prices.
 * The answers tick the matching options, or lead to the contact page for a need outside the
 * subscription. They stay in this component and are never sent; only the simulation goes along with
 * the free mockup request.
 */
export function PricingGuide({ plan, region, onApply }: PricingGuideProps) {
  const t = useTranslations('pricing');
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState<GuideAnswers>(INITIAL_ANSWERS);
  const [confirming, setConfirming] = useState(false);
  const outcome = getOutcome(answers);

  const answer = (patch: Partial<GuideAnswers>) => {
    setAnswers((current) => ({ ...current, ...patch }));
    setConfirming(false);
  };
  const apply = () => {
    onApply(answersToChoices(answers));
    setConfirming(false);
    setOpen(false);
  };
  // The answers would overwrite options ticked by hand: ask first.
  const submit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (getPlanItems(plan).length > 1) setConfirming(true);
    else apply();
  };

  return (
    <div className="border-line bg-surface rounded-2xl border p-4 sm:p-6">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={formId}
        onClick={() => setOpen(!open)}
        className={ghostPill('w-full justify-between sm:w-fit')}>
        {t('guide.button')}
        <ChevronDownIcon
          aria-hidden="true"
          className={cn('size-4 transition-transform motion-reduce:transition-none', { 'rotate-180': open })}
        />
      </button>
      <form id={formId} hidden={!open} onSubmit={submit} className="mt-6 flex flex-col gap-6">
        <p className="text-fg-2 max-w-[60ch]">{t('guide.intro')}</p>
        <ChoiceGroup<Situation>
          legend={t('guide.situation.legend')}
          type="radio"
          choices={(['new', 'existing', 'custom'] as const).map((value) => ({
            value,
            label: t(`guide.situation.${value}`),
          }))}
          selected={answers.situation ? [answers.situation] : []}
          onChange={(situation) => answer({ situation })}
        />
        {answers.situation === 'existing' && (
          <ChoiceGroup<ExistingPlan>
            legend={t('guide.existing.legend')}
            type="radio"
            choices={(['redo', 'keep'] as const).map((value) => ({ value, label: t(`guide.existing.${value}`) }))}
            selected={answers.existingPlan ? [answers.existingPlan] : []}
            onChange={(existingPlan) => answer({ existingPlan })}
          />
        )}
        {(outcome === 'contact' || outcome === 'quote') && <GuideOutcome outcome={outcome} />}
        {outcome === 'compose' && (
          <>
            <GuideQuestions
              answers={answers}
              onAnswer={answer}
              domain={t(`builder.options.example_domain.${region}`)}
            />
            {confirming ? (
              <ReplaceConfirm onReplace={apply} onCancel={() => setConfirming(false)} />
            ) : (
              <button type="submit" className={primaryPill('w-fit')}>
                {t('guide.submit')}
              </button>
            )}
          </>
        )}
      </form>
    </div>
  );
}
