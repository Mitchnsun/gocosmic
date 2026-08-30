'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import type { Currency } from '@/lib/region';

import { ContactBanner } from './ContactBanner';
import { OptionButton } from './OptionButton';
import type { ProjectType, UpdateFrequency, WebsiteType } from './PricingSimulator.types';
import { RateCard } from './RateCard';
import { StepCard } from './StepCard';
import { SubscriptionCard } from './SubscriptionCard';

interface PricingSimulatorProps {
  currency: Currency;
}

export function PricingSimulator({ currency }: PricingSimulatorProps) {
  const t = useTranslations('pricing');

  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [websiteType, setWebsiteType] = useState<WebsiteType | null>(null);
  const [updateFrequency, setUpdateFrequency] = useState<UpdateFrequency | null>(null);

  const showStep2 = projectType === 'website';
  const showMobileResult = projectType === 'mobile';
  const showBothResult = projectType === 'both';
  const showComplexResult = showStep2 && (websiteType === 'accounts' || websiteType === 'ecommerce');
  const showStep3 = showStep2 && websiteType === 'showcase';
  const showSubscriptionResult = showStep3 && updateFrequency !== null && updateFrequency !== 'self_managed';
  const showCmsResult = showStep3 && updateFrequency === 'self_managed';
  const showContactForResult = showMobileResult || showBothResult || showComplexResult || showCmsResult;

  const handleProjectTypeChange = (type: ProjectType) => {
    setProjectType(type);
    setWebsiteType(null);
    setUpdateFrequency(null);
  };

  const handleWebsiteTypeChange = (type: WebsiteType) => {
    setWebsiteType(type);
    setUpdateFrequency(null);
  };

  const handleReset = () => {
    setProjectType(null);
    setWebsiteType(null);
    setUpdateFrequency(null);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Project type */}
      <StepCard>
        <p className="mb-6 text-lg font-semibold text-white sm:text-xl">{t('step1.question')}</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          {(['website', 'mobile', 'both'] as ProjectType[]).map((option) => (
            <OptionButton
              key={option}
              label={t(`step1.options.${option}`)}
              selected={projectType === option}
              onClick={() => handleProjectTypeChange(option)}
            />
          ))}
        </div>
      </StepCard>

      {/* Step 2: Website type (website only) */}
      {showStep2 && (
        <StepCard>
          <p className="mb-6 text-lg font-semibold text-white sm:text-xl">{t('step2.question')}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {(['showcase', 'accounts', 'ecommerce'] as WebsiteType[]).map((option) => (
              <OptionButton
                key={option}
                label={t(`step2.options.${option}`)}
                selected={websiteType === option}
                onClick={() => handleWebsiteTypeChange(option)}
              />
            ))}
          </div>
        </StepCard>
      )}

      {/* Step 3: Update frequency (showcase only) */}
      {showStep3 && (
        <StepCard>
          <p className="mb-6 text-lg font-semibold text-white sm:text-xl">{t('step3.question')}</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            {(['few_per_year', 'monthly', 'weekly', 'self_managed'] as UpdateFrequency[]).map((option) => (
              <OptionButton
                key={option}
                label={t(`step3.options.${option}`)}
                selected={updateFrequency === option}
                onClick={() => setUpdateFrequency(option)}
              />
            ))}
          </div>
        </StepCard>
      )}

      {/* Result: Both website + mobile (single combined daily rate) */}
      {showBothResult && (
        <div className="animate-fade-in-up">
          <section className="rounded-lg bg-slate-800 px-6 py-8" aria-labelledby="both-result-heading">
            <h2 id="both-result-heading" className="sr-only">
              {t('results.both.title')}
            </h2>
            <RateCard
              title={t('results.both.title')}
              rate={t(`results.both.rate.${currency}`)}
              rateNote={t('results.both.rate_note')}
              description={t('results.both.description')}
              disclaimer={t('results.both.disclaimer')}
              accentColor="amber"
            />
          </section>
        </div>
      )}

      {/* Result: Complex website (accounts or ecommerce) */}
      {showComplexResult && (
        <div key={`complex-${websiteType}`} className="animate-fade-in-up">
          <section className="rounded-lg bg-slate-800 px-6 py-8" aria-labelledby="complex-result-heading">
            <h2 id="complex-result-heading" className="sr-only">
              {t('results.complex_website.title')}
            </h2>
            <RateCard
              title={t('results.complex_website.title')}
              rate={t(`results.complex_website.rate.${currency}`)}
              rateNote={t('results.complex_website.rate_note')}
              description={t('results.complex_website.description')}
              disclaimer={t('results.complex_website.disclaimer')}
              noFixedPrice={t('results.complex_website.no_fixed_price')}
              accentColor="purple"
            />
          </section>
        </div>
      )}

      {/* Result: Subscription (showcase — fixed price plans) */}
      {showSubscriptionResult && (
        <div key={`subscription-${updateFrequency}`} className="animate-fade-in-up">
          <section className="rounded-lg bg-slate-800 px-6 py-8" aria-labelledby="subscription-result-heading">
            <h2 id="subscription-result-heading" className="sr-only">
              {t(`results.subscription.${updateFrequency as 'few_per_year' | 'monthly' | 'weekly'}.title`)}
            </h2>
            <SubscriptionCard
              freq={updateFrequency as 'few_per_year' | 'monthly' | 'weekly'}
              t={t}
              currency={currency}
            />
            <ContactBanner t={t} />
          </section>
        </div>
      )}

      {/* Result: CMS self-managed */}
      {showCmsResult && (
        <div className="animate-fade-in-up">
          <section className="rounded-lg bg-slate-800 px-6 py-8" aria-labelledby="cms-result-heading">
            <h2 id="cms-result-heading" className="sr-only">
              {t('results.subscription.self_managed.title')}
            </h2>
            <RateCard
              title={t('results.subscription.self_managed.title')}
              rate={t(`results.subscription.self_managed.rate.${currency}`)}
              rateNote={t('results.subscription.self_managed.rate_note')}
              description={t('results.subscription.self_managed.description')}
              disclaimer={t('results.subscription.self_managed.disclaimer')}
              accentColor="yellow"
            />
          </section>
        </div>
      )}

      {/* Result: Mobile application */}
      {showMobileResult && (
        <div className="animate-fade-in-up">
          <section className="rounded-lg bg-slate-800 px-6 py-8" aria-labelledby="mobile-result-heading">
            <h2 id="mobile-result-heading" className="sr-only">
              {t('results.mobile.title')}
            </h2>
            <RateCard
              title={t('results.mobile.title')}
              rate={t(`results.mobile.rate.${currency}`)}
              rateNote={t('results.mobile.rate_note')}
              description={t('results.mobile.description')}
              disclaimer={t('results.mobile.disclaimer')}
              accentColor="amber"
            />
          </section>
        </div>
      )}

      {/* Shared contact banner for rate-based results */}
      {showContactForResult && (
        <div className="animate-fade-in-up">
          <ContactBanner t={t} />
        </div>
      )}

      {/* Reset button */}
      {projectType && (
        <div className="animate-fade-in-up flex justify-center pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded px-5 py-2 text-sm font-medium text-gray-400 ring-1 ring-slate-600 transition-colors hover:bg-slate-800 hover:text-white focus:ring-blue-400 focus:outline-none">
            {t('reset')}
          </button>
        </div>
      )}
    </div>
  );
}
