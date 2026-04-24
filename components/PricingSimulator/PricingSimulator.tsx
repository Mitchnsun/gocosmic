'use client';

import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { cn } from '@/design-system/lib/utils';

type ProjectType = 'website' | 'mobile' | 'both';
type WebsiteType = 'showcase' | 'accounts' | 'ecommerce';
type UpdateFrequency = 'few_per_year' | 'monthly' | 'weekly' | 'self_managed';

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-lg border-2 px-6 py-4 text-left text-base font-medium transition-all duration-200 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none',
        selected
          ? 'border-blue-400 bg-blue-400/10 text-white'
          : 'border-slate-600 bg-slate-800 text-gray-300 hover:border-slate-400 hover:bg-slate-700 hover:text-white'
      )}>
      {label}
    </button>
  );
}

interface StepCardProps {
  children: React.ReactNode;
}

function StepCard({ children }: StepCardProps) {
  return (
    <div className="animate-fade-in-up rounded-lg bg-slate-800/60 px-6 py-8 ring-1 ring-slate-700">{children}</div>
  );
}

interface RateCardProps {
  title: string;
  rate: string;
  rateNote: string;
  description: string;
  disclaimer: string;
  noFixedPrice?: string;
  accentColor: 'amber' | 'purple' | 'yellow';
}

function getRateColorClass(accentColor: 'amber' | 'purple' | 'yellow'): string {
  switch (accentColor) {
    case 'amber': {
      return 'text-amber-400';
    }
    case 'purple': {
      return 'text-purple-400';
    }
    case 'yellow': {
      return 'text-yellow-400';
    }
  }
}

function RateCard({ title, rate, rateNote, description, disclaimer, noFixedPrice, accentColor }: RateCardProps) {
  const colorClass = getRateColorClass(accentColor);

  return (
    <div className="space-y-4">
      <h3 className={cn('text-xl font-bold sm:text-2xl', colorClass)}>{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className={cn('text-4xl font-extrabold', colorClass)}>{rate}</span>
        <sup className={cn('text-sm', colorClass)}>{rateNote}</sup>
      </div>
      <p className="text-gray-300">{description}</p>
      {noFixedPrice && (
        <p className="rounded-md bg-slate-700/50 px-4 py-3 text-sm font-medium text-gray-200 italic">{noFixedPrice}</p>
      )}
      <p className="text-xs text-gray-500">{disclaimer}</p>
    </div>
  );
}

interface SubscriptionCardProps {
  freq: 'few_per_year' | 'monthly' | 'weekly';
  t: ReturnType<typeof useTranslations<'pricing'>>;
}

type SubscriptionItemKey = 'site' | 'seo' | 'updates' | 'domain' | 'hosting' | 'ssl' | 'email' | 'content_update';

function getSubscriptionItems(freq: 'few_per_year' | 'monthly' | 'weekly'): SubscriptionItemKey[] {
  switch (freq) {
    case 'few_per_year': {
      return ['site', 'seo', 'updates', 'domain', 'hosting', 'ssl', 'email'];
    }
    case 'monthly': {
      return ['site', 'seo', 'updates', 'domain', 'hosting', 'ssl', 'email', 'content_update'];
    }
    case 'weekly': {
      return ['site', 'seo', 'updates', 'domain', 'hosting', 'ssl', 'email', 'content_update'];
    }
  }
}

function getSubscriptionColor(freq: 'few_per_year' | 'monthly' | 'weekly'): string {
  switch (freq) {
    case 'few_per_year': {
      return 'text-jungle';
    }
    case 'monthly': {
      return 'text-blue-400';
    }
    case 'weekly': {
      return 'text-royal';
    }
  }
}

function SubscriptionCard({ freq, t }: SubscriptionCardProps) {
  const color = getSubscriptionColor(freq);
  const items = getSubscriptionItems(freq);
  return (
    <div className="space-y-4">
      <h3 className={cn('text-xl font-bold sm:text-2xl', color)}>{t(`results.subscription.${freq}.title`)}</h3>
      <div className="flex items-baseline gap-2">
        <span className={cn('text-4xl font-extrabold', color)}>{t(`results.subscription.${freq}.price`)}</span>
        <span className="text-sm text-gray-400">{t(`results.subscription.${freq}.duration`)}</span>
      </div>
      <div>
        <p className="mb-3 font-semibold text-white">{t(`results.subscription.${freq}.includes.title`)}</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <CheckCircleIcon className={cn('h-5 w-5 shrink-0', color)} aria-hidden="true" />
              <span className="text-gray-300">{t(`results.subscription.${freq}.includes.items.${item}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

interface ContactBannerProps {
  t: ReturnType<typeof useTranslations<'pricing'>>;
}

function ContactBanner({ t }: ContactBannerProps) {
  const email = t('contact.email');
  const subject = encodeURIComponent(t('contact.subject'));
  return (
    <div className="mt-6 rounded-lg border border-slate-600 bg-slate-900/60 px-6 py-6">
      <h4 className="mb-2 text-base font-semibold text-white">{t('contact.title')}</h4>
      <p className="mb-4 text-sm text-gray-400">{t('contact.description')}</p>
      <a
        href={`mailto:${email}?subject=${subject}`}
        className="text-jungle ring-jungle hover:bg-jungle/10 focus:ring-jungle inline-flex items-center gap-2 rounded px-4 py-2 font-semibold ring-2 transition-colors focus:outline-none"
        aria-label={t('contact.aria_label')}>
        {t('contact.cta')}
        <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
      </a>
      <p className="mt-3 text-sm text-gray-500">{email}</p>
    </div>
  );
}

export function PricingSimulator() {
  const t = useTranslations('pricing');

  const [projectType, setProjectType] = useState<ProjectType | null>(null);
  const [websiteType, setWebsiteType] = useState<WebsiteType | null>(null);
  const [updateFrequency, setUpdateFrequency] = useState<UpdateFrequency | null>(null);

  const showStep2 = projectType === 'website' || projectType === 'both';
  const showMobileResult = projectType === 'mobile' || projectType === 'both';
  const showComplexResult = showStep2 && (websiteType === 'accounts' || websiteType === 'ecommerce');
  const showStep3 = showStep2 && websiteType === 'showcase';
  const showSubscriptionResult = showStep3 && updateFrequency !== null && updateFrequency !== 'self_managed';
  const showCmsResult = showStep3 && updateFrequency === 'self_managed';
  const showContactForResult = showMobileResult || showComplexResult || showCmsResult;

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

      {/* Step 2: Website type */}
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

      {/* Result: Complex website (accounts or ecommerce) */}
      {showComplexResult && (
        <div key={`complex-${websiteType}`} className="animate-fade-in-up">
          <section className="rounded-lg bg-slate-800 px-6 py-8" aria-labelledby="complex-result-heading">
            <h2 id="complex-result-heading" className="sr-only">
              {t('results.complex_website.title')}
            </h2>
            <RateCard
              title={t('results.complex_website.title')}
              rate={t('results.complex_website.rate')}
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
            <SubscriptionCard freq={updateFrequency as 'few_per_year' | 'monthly' | 'weekly'} t={t} />
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
              rate={t('results.subscription.self_managed.rate')}
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
              rate={t('results.mobile.rate')}
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
