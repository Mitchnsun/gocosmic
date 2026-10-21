import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import { Faq } from '@/components/Faq';
import { freeMockupNote } from '@/components/FreeMockup';
import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';
import FaqSeo from '@/components/JsonLd/FaqSeo';
import ServiceSeo from '@/components/JsonLd/ServiceSeo';
import { PricingColumns } from '@/components/PricingColumns';
import { buildPricingColumns } from '@/components/PricingColumns/PricingColumns.utils';
import { BASE_PRICE, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { SectionHeading } from '@/components/SectionHeading';
import { ServicesGrid } from '@/components/ServicesGrid';
import { CONTENT_PAGE_LABELS, REINFORCEMENT_PAGE, TRADE_PAGES } from '@/data/content-pages';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP, primaryPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { hasRoute } from '@/i18n/route-locales';
import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';
import { type Currency, getCurrency, getRegion } from '@/lib/region';
import { buildPageMetadata } from '@/lib/seo';

type ServicesTranslator = Awaited<ReturnType<typeof getTranslations<'services'>>>;

/** One description for search results and structured data, quoting the starting price in the page's currency. */
const describeServices = (t: ServicesTranslator, currency: Currency, locale: string) =>
  t('meta.description', { price: formatAmount(BASE_PRICE, currency, locale) });

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return buildPageMetadata({
    locale,
    routeKey: '/services',
    title: t('meta.title'),
    // Swiss francs on the Swiss URLs.
    description: describeServices(t, getCurrency(getRegion(locale)), locale),
  });
}

const TRADES = ['showcase', 'shops', 'apps', 'care'] as const;
const QUESTIONS = ['existing', 'ownership', 'edit', 'timing', 'stop', 'content'] as const;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Services: the trades, the four ways to work with the studio, the two formulas of the subscription and the FAQ. */
export default async function Services({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('services');
  const tPricing = await getTranslations('pricing.columns');
  const tHome = await getTranslations('homepage');
  const tLinks = await getTranslations('contentPages');
  const region = getRegion(locale);
  const currency = getCurrency(region);
  const [subscription, guidance, reinforcement, custom] = buildPricingColumns(tPricing, region, locale);
  // The "Reinforcement" column links to the redesign page in the languages it is published in.
  const pricing = [
    subscription,
    guidance,
    hasRoute(locale, REINFORCEMENT_PAGE)
      ? {
          ...reinforcement,
          link: { label: tLinks(`links.${CONTENT_PAGE_LABELS[REINFORCEMENT_PAGE]}.label`), href: REINFORCEMENT_PAGE },
        }
      : reinforcement,
    custom,
  ];
  const months = String(CODE_HANDOVER_MONTHS);
  const faqItems = QUESTIONS.map((question) => ({
    question: t(`faq.items.${question}.question`),
    answer: t(`faq.items.${question}.answer`, { months }),
  }));

  return (
    <div className="bg-bg text-fg">
      <section aria-labelledby="services-intro" className={PAGE_TOP}>
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

      <ServicesGrid
        eyebrow={t('trades.eyebrow')}
        title={t.rich('trades.title', { em })}
        services={TRADES.map((trade) => {
          // A trade links to its own page in the languages that page is published in.
          const page = TRADE_PAGES[trade];
          return {
            title: t(`trades.items.${trade}.title`),
            description: t(`trades.items.${trade}.description`),
            tags: t.raw(`trades.items.${trade}.tags`) as string[],
            link:
              page && hasRoute(locale, page)
                ? { label: tLinks(`links.${CONTENT_PAGE_LABELS[page]}.label`), href: page }
                : undefined,
          };
        })}
      />

      <PricingColumns eyebrow={tPricing('eyebrow')} title={tPricing('title')} columns={pricing} />

      {/* The two formulas, leading to the pricing page; `#simulator` keeps older links working. */}
      <section id="simulator" aria-labelledby="simulator-heading" className={cn('bg-bg-alt scroll-mt-20', SECTION_Y)}>
        <div className={cn(CONTAINER, 'flex flex-col items-start gap-8')}>
          <SectionHeading
            eyebrow={t('simulator.eyebrow')}
            title={t.rich('simulator.title', { em })}
            titleId="simulator-heading"
            lead={t('simulator.lead', {
              price: formatAmount(BASE_PRICE, currency, locale),
              selfServicePrice: formatAmount(FORMULA_PRICES.self_service, currency, locale),
            })}
          />
          <Link href="/pricing" className={primaryPill()}>
            {tPricing('subscription.cta')}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <Faq eyebrow={t('faq.eyebrow')} title={t.rich('faq.title', { em })} items={faqItems} />
      <FaqSeo items={faqItems} />
      <BreadcrumbSeo route="/services" />
      <ServiceSeo description={describeServices(t, currency, locale)} offer={{ price: BASE_PRICE, region }} />

      <CTAFinal
        id="services-cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.primary_button')}
        ctaHref="/contact"
        note={freeMockupNote(tHome)}
        tone="sober"
      />
    </div>
  );
}
