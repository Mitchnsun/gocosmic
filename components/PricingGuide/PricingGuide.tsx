'use client';

import { useTranslations } from 'next-intl';

import type { PlanSelection } from '@/components/PricingSimulator/PricingSimulator.types';
import { Eyebrow } from '@/design-system/eyebrow';
import { ghostPill, primaryPill } from '@/design-system/pill';
import type { Region } from '@/lib/region';

import { GuideOutcome } from './GuideOutcome';
import { GuideQuestion } from './GuideQuestion';
import { usePricingGuide } from './PricingGuide.hooks';
import { ReplaceConfirm } from './ReplaceConfirm';

interface PricingGuideProps {
  /** The simulator's normalised plan, to know whether options are already ticked. */
  plan: PlanSelection;
  region: Region;
  /** Puts the composition into the simulator. */
  onApply: (choices: PlanSelection) => void;
}

/**
 * "Help me choose": one question at a time, above a simulator that stays visible with its prices. The
 * answers tick the matching options, or lead to the contact page for a need outside the subscription.
 * They stay in this component and are never sent; only the simulation goes along with the free mockup
 * request.
 */
export function PricingGuide({ plan, region, onApply }: PricingGuideProps) {
  const t = useTranslations('pricing');
  const guide = usePricingGuide(plan, onApply);
  const { steps, current, last, outcome, submittable, confirming } = guide;
  const ending = last && (outcome === 'contact' || outcome === 'quote') ? outcome : null;

  return (
    // The listeners only note whether the answer came from a pointer or the keyboard; they add no interaction.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <form
      aria-label={t('guide.title')}
      onSubmit={guide.submit}
      onPointerDown={guide.notePointer}
      onKeyDown={guide.noteKeyboard}
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
      <div ref={guide.questionRef}>
        <GuideQuestion
          step={guide.step}
          answers={guide.answers}
          onAnswer={guide.answer}
          domain={t(`builder.options.example_domain.${region}`)}
        />
      </div>
      {/* Always rendered, even empty, so screen readers announce the ending when it appears. */}
      <div aria-live="polite">{ending && <GuideOutcome outcome={ending} />}</div>
      {confirming && <ReplaceConfirm onReplace={guide.apply} onCancel={guide.cancel} />}
      {!confirming && (current > 0 || !last || submittable) && (
        <div className="flex flex-wrap gap-3">
          {current > 0 && (
            <button type="button" onClick={() => guide.goTo(steps[current - 1])} className={ghostPill()}>
              {t('guide.back')}
            </button>
          )}
          {!last && (
            <button type="button" onClick={() => guide.goTo(steps[current + 1])} className={ghostPill()}>
              {t('guide.next')}
            </button>
          )}
          {submittable && (
            <button ref={guide.submitRef} type="submit" className={primaryPill()}>
              {t('guide.submit')}
            </button>
          )}
        </div>
      )}
    </form>
  );
}
