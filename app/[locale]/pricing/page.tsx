import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';
import PriceCatalogSeo from '@/components/JsonLd/PriceCatalogSeo';
import { FreeOffers, PricingSimulator, QuotedServices } from '@/components/PricingSimulator';
import { formatStartingPrice } from '@/components/PricingSimulator/PricingSimulator.utils';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP, SECTION_Y } from '@/design-system/pill';
import { getClientMessages } from '@/i18n/client-messages';
import { getRegion } from '@/lib/region';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricingPage.meta' });

  return buildPageMetadata({
    locale,
    routeKey: '/pricing',
    title: t('title'),
    // Swiss francs on the Swiss URLs.
    description: t('description', { price: formatStartingPrice(locale) }),
  });
}

const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Pricing: the free offers first, then the subscription simulator and its guided mode, then the services quoted apart. */
export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pricingPage');
  const messages = await getClientMessages(['pricing']);
  const region = getRegion(locale);

  return (
    <div className="bg-bg text-fg">
      <section aria-labelledby="pricing-intro" className={PAGE_TOP}>
        <div className={CONTAINER}>
          <SectionHeading
            level={1}
            eyebrow={t('intro.eyebrow')}
            title={t.rich('intro.title', { em })}
            titleId="pricing-intro"
            lead={t('intro.lead')}
          />
        </div>
      </section>

      <div className={cn(CONTAINER, SECTION_Y, 'flex flex-col gap-10')}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FreeOffers />
          {/* Its own heading, so the simulator is not read as part of the free offers above it. */}
          <section aria-labelledby="simulator-heading">
            <h2 id="simulator-heading" className="sr-only">
              {t('simulator.title')}
            </h2>
            <PricingSimulator region={region} />
          </section>
          <QuotedServices />
        </NextIntlClientProvider>
      </div>

      <BreadcrumbSeo route="/pricing" />
      <PriceCatalogSeo region={region} />
    </div>
  );
}
