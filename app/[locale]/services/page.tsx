import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import { Faq } from '@/components/Faq';
import { PricingColumns } from '@/components/PricingColumns';
import { buildPricingColumns } from '@/components/PricingColumns/PricingColumns.utils';
import { FreeOffers, PricingSimulator } from '@/components/PricingSimulator';
import { BASE_PRICE, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { SectionHeading } from '@/components/SectionHeading';
import { ServicesGrid } from '@/components/ServicesGrid';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';
import { getCurrency } from '@/lib/region';
import { getRegion } from '@/lib/region.server';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return buildPageMetadata({
    locale,
    routeKey: '/services',
    title: t('meta.title'),
    description: t('meta.description'),
  });
}

const TRADES = ['showcase', 'shops', 'apps', 'care'] as const;
const QUESTIONS = ['ownership', 'edit', 'timing', 'stop', 'content'] as const;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Services & pricing: the former services, offers and pricing pages merged into one. */
export default async function Services() {
  const t = await getTranslations('services');
  const tPricing = await getTranslations('pricing.columns');
  const locale = await getLocale();
  const messages = await getMessages();
  const region = await getRegion();
  const currency = getCurrency(region);
  const pricing = buildPricingColumns(tPricing, region, locale);
  const months = String(CODE_HANDOVER_MONTHS);

  return (
    <div className="bg-bg text-fg">
      <section aria-labelledby="services-intro" className="pt-[clamp(3rem,6.5vw,5.5rem)]">
        <div className={CONTAINER}>
          <SectionHeading
            level={1}
            eyebrow={t('intro.eyebrow')}
            title={t.rich('intro.title', { em })}
            titleId="services-intro"
            lead={t('intro.lead')}
          />
        </div>
      </section>

      <PricingColumns eyebrow={tPricing('eyebrow')} title={tPricing('title')} columns={pricing} />

      <section id="simulator" aria-labelledby="simulator-heading" className={cn('bg-bg-alt scroll-mt-20', SECTION_Y)}>
        <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
          <SectionHeading
            eyebrow={t('simulator.eyebrow')}
            title={t.rich('simulator.title', { em })}
            titleId="simulator-heading"
            lead={t('simulator.lead', {
              price: formatAmount(BASE_PRICE, currency, locale),
              selfServicePrice: formatAmount(FORMULA_PRICES.self_service, currency, locale),
            })}
          />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <PricingSimulator region={region} />
            <FreeOffers />
          </NextIntlClientProvider>
        </div>
      </section>

      <ServicesGrid
        eyebrow={t('trades.eyebrow')}
        title={t.rich('trades.title', { em })}
        services={TRADES.map((trade) => ({
          title: t(`trades.items.${trade}.title`),
          description: t(`trades.items.${trade}.description`),
          tags: t.raw(`trades.items.${trade}.tags`) as string[],
        }))}
      />

      <Faq
        eyebrow={t('faq.eyebrow')}
        title={t.rich('faq.title', { em })}
        items={QUESTIONS.map((question) => ({
          question: t(`faq.items.${question}.question`),
          answer: t(`faq.items.${question}.answer`, { months }),
        }))}
      />

      <CTAFinal
        id="services-cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.primary_button')}
        ctaHref="/contact"
        accentColor="aerospace"
        tone="sober"
      />
    </div>
  );
}
