import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AccentList } from '@/components/AccentList';
import { ContentPage, formatCounter, PlanExample, TermList } from '@/components/ContentPage';
import { ContentSection } from '@/components/ContentSection';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { WEBSITE_FOR_TRADESPEOPLE } from '@/data/content-pages';
import { getCurrency, getRegion } from '@/lib/region';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/website-for-tradespeople';
const SECTION_COUNT = 5;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const counter = (position: number) => formatCounter(position, SECTION_COUNT);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'websiteForTradespeople.meta' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('title'),
    description: t('description', { price: formatAmount(BASE_PRICE, getCurrency(getRegion(locale)), locale) }),
  });
}

/**
 * Website for tradespeople, in French only: what the site says, being found on Google, the options, an example and
 * the free mockup. It has no case study yet: the free mockup stands in until one can be shown.
 */
export default async function WebsiteForTradespeople({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('websiteForTradespeople');
  const tNav = await getTranslations('navigation');
  const tPricing = await getTranslations('pricing.builder');
  const tMockup = await getTranslations('freeMockup.steps');
  const domain = tPricing(`options.example_domain.${getRegion(locale)}`);

  return (
    <ContentPage
      breadcrumb={[
        { label: tNav('services'), href: '/services' },
        { label: t('breadcrumb'), href: ROUTE },
      ]}
      eyebrow={t('intro.eyebrow')}
      title={t.rich('intro.title', { em })}
      lead={t('intro.lead')}
      related={['pricing', 'services']}
      cta={{
        headline: t('cta.title'),
        description: t('cta.description'),
        button: t('cta.button'),
        href: '/free-mockup',
      }}>
      <ContentSection
        id="says"
        eyebrow={t('says.eyebrow')}
        index={counter(1)}
        title={t('says.title')}
        lead={t('says.lead')}>
        <AccentList
          items={Object.values(t.raw('says.points') as Record<string, string>)}
          accent="jungle"
          columns={2}
          ariaLabel={t('says.title')}
        />
      </ContentSection>

      <ContentSection
        id="google"
        eyebrow={t('google.eyebrow')}
        index={counter(2)}
        title={t('google.title')}
        lead={t('google.lead')}>
        <TermList
          items={[
            { term: tPricing('options.seo.label'), description: t('google.follow_up_text') },
            { term: t('google.listing'), description: t('google.listing_text') },
          ]}
        />
      </ContentSection>

      <ContentSection
        id="options"
        eyebrow={t('features.eyebrow')}
        index={counter(3)}
        title={t('features.title')}
        lead={t('features.lead')}>
        <TermList
          items={[
            ...WEBSITE_FOR_TRADESPEOPLE.options.map((option) => ({
              term: tPricing(`options.${option}.label`),
              description: tPricing(`options.${option}.hint`, { domain }),
            })),
            { term: tPricing('pages.label'), description: tPricing('pages.info') },
          ]}
        />
      </ContentSection>

      <ContentSection
        id="example"
        eyebrow={t('example.eyebrow')}
        index={counter(4)}
        title={t('example.title')}
        lead={t('example.lead')}>
        <PlanExample example={WEBSITE_FOR_TRADESPEOPLE.example} />
      </ContentSection>

      <ContentSection
        id="mockup"
        eyebrow={t('mockup.eyebrow')}
        index={counter(5)}
        title={t('mockup.title')}
        lead={t('mockup.lead')}>
        <TermList
          // The steps of the free mockup, as its own page lists them.
          items={Object.keys(tMockup.raw('items') as Record<string, unknown>).map((step) => ({
            term: tMockup(`items.${step}.title`),
            description: tMockup(`items.${step}.description`),
          }))}
        />
      </ContentSection>
    </ContentPage>
  );
}
