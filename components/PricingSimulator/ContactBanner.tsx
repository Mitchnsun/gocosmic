'use client';

import { EnvelopeIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';
import { type DecodedPlan, encodePlanCode } from '@/lib/pricing/plan-code';
import { storePlanCode } from '@/lib/pricing/plan-storage';

import { buildQuoteEmailBody } from './PricingSimulator.summary';

interface ContactBannerProps {
  /** The visitor's simulation, carried over to the quote email and the mockup form. */
  plan?: DecodedPlan;
}

export function ContactBanner({ plan }: ContactBannerProps) {
  // The `contact.*` keys currently live under the `pricing` namespace because this banner is
  // only used in the pricing simulator. If ContactBanner is ever reused outside pricing, move
  // those keys to the `common` namespace instead.
  const t = useTranslations('pricing');
  const email = t('contact.email');
  const subject = encodeURIComponent(t('contact.subject'));
  const body = plan ? `&body=${encodeURIComponent(buildQuoteEmailBody(t, plan))}` : '';

  return (
    <div className="border-ghost/8 bg-ghost/2 rounded-2xl border p-6">
      <h4 className="font-display text-ghost mb-2 text-lg font-semibold">{t('contact.title')}</h4>
      <p className="text-ghost/55 mb-5 text-sm">{t('contact.description')}</p>
      <div className="flex flex-col items-center gap-6 md:flex-row">
        <a
          href={`mailto:${email}?subject=${subject}${body}`}
          className={cn(buttonVariants({ variant: 'jungle' }), 'inline-flex items-center gap-2')}
          aria-label={t('contact.aria_label')}>
          {t('contact.cta')}
          <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
        </a>
        <Link
          href="/free-mockup"
          onClick={() => plan && storePlanCode(encodePlanCode(plan))}
          className={cn(buttonVariants({ variant: 'jungle' }), 'inline-flex items-center gap-2')}
          aria-label={t('contact.free_mockup_cta_aria_label')}>
          {t('contact.free_mockup_cta_label')}
          <SparklesIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="text-ghost/35 font-mono text-sm">{email}</p>
      </div>
      <p className="text-ghost/35 mt-3 text-sm">
        {t('contact.privacy_notice')}{' '}
        <Link href="/privacy" className="hover:text-ghost/55 underline transition">
          {t('contact.privacy_link')}
        </Link>
        .
      </p>
    </div>
  );
}
