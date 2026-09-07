'use client';

import { useTranslations } from 'next-intl';

import type { Currency } from '@/lib/region';

import { ContactBanner } from './ContactBanner';
import { OptionButton } from './OptionButton';
import { PlanBuilder } from './PlanBuilder';
import { usePricingSimulator } from './PricingSimulator.hooks';
import type { ProjectType, WebsiteType } from './PricingSimulator.types';
import { QuoteCard } from './QuoteCard';
import { StepCard } from './StepCard';

const PROJECT_TYPES: ProjectType[] = ['website', 'mobile', 'both'];
const WEBSITE_TYPES: WebsiteType[] = ['showcase', 'self_managed', 'accounts', 'ecommerce'];

interface PricingSimulatorProps {
  currency: Currency;
}

export function PricingSimulator({ currency }: PricingSimulatorProps) {
  const t = useTranslations('pricing');
  const simulator = usePricingSimulator();

  return (
    <div className="space-y-6">
      {/* Step 1 — what the visitor wants to build */}
      <StepCard>
        <p className="font-display text-ghost mb-6 text-lg font-semibold sm:text-xl">{t('step1.question')}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {PROJECT_TYPES.map((option) => (
            <OptionButton
              key={option}
              label={t(`step1.options.${option}`)}
              selected={simulator.projectType === option}
              onClick={() => simulator.chooseProjectType(option)}
            />
          ))}
        </div>
      </StepCard>

      {/* Step 2 — which kind of website */}
      {simulator.showWebsiteTypes && (
        <StepCard>
          <p className="font-display text-ghost mb-6 text-lg font-semibold sm:text-xl">{t('step2.question')}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {WEBSITE_TYPES.map((option) => (
              <OptionButton
                key={option}
                label={t(`step2.options.${option}`)}
                selected={simulator.websiteType === option}
                onClick={() => simulator.chooseWebsiteType(option)}
              />
            ))}
          </div>
        </StepCard>
      )}

      {/* Showcase site — compose the plan and watch the total move */}
      {simulator.showPlanBuilder && (
        <div className="animate-fade-in-up space-y-6">
          <PlanBuilder
            currency={currency}
            selection={simulator.selection}
            total={simulator.total}
            showQuoteHint={simulator.showQuoteHint}
            onToggleAddOn={simulator.toggleAddOn}
            onToggleUpdates={simulator.toggleUpdates}
            onPagesChange={simulator.setPages}
            onUpdatesChange={simulator.setUpdates}
          />
          <ContactBanner t={t} />
        </div>
      )}

      {/* Every other path — a conversation, not a figure */}
      {simulator.showQuote && (
        <div className="animate-fade-in-up space-y-6">
          <section
            aria-labelledby="quote-result-heading"
            className="border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6 sm:p-8">
            <h2 id="quote-result-heading" className="sr-only">
              {t('results.custom.title')}
            </h2>
            <QuoteCard
              note={t('results.custom.note')}
              title={t('results.custom.title')}
              description={t('results.custom.description')}
            />
          </section>
          <ContactBanner t={t} />
        </div>
      )}

      {/* Reset */}
      {simulator.projectType && (
        <div className="animate-fade-in-up flex justify-center pt-2">
          <button
            type="button"
            onClick={simulator.reset}
            className="border-ghost/15 text-ghost/55 hover:border-ghost hover:text-ghost focus-visible:ring-aerospace rounded-full border px-5 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none">
            {t('reset')}
          </button>
        </div>
      )}
    </div>
  );
}
