import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { FreeOffers, PricingSimulator } from '@/components/PricingSimulator';
import { getCurrency } from '@/lib/region';
import { getRegion } from '@/lib/region.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function Pricing() {
  const t = await getTranslations('pricing');
  const locale = await getLocale();
  const messages = await getMessages();
  const currency = getCurrency(await getRegion());

  return (
    <div className="bg-void text-ghost relative pt-10" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <div className="m-auto flex max-w-5xl flex-col items-center gap-10 px-4 pb-16 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="w-full">
          <p className="text-aerospace text-2xs flex items-center gap-2 font-mono tracking-[0.24em] uppercase">
            <span className="bg-aerospace h-1.5 w-1.5 rounded-full" aria-hidden="true" />
            {t('eyebrow')}
          </p>
          <h1 className="font-display mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-5xl">{t('title')}</h1>
          <p className="text-ghost/55 mt-4 max-w-2xl text-lg">{t('subtitle')}</p>
        </div>

        <NextIntlClientProvider locale={locale} messages={messages}>
          {/* Free, no-commitment offers */}
          <FreeOffers />

          {/* Simulator */}
          <div className="w-full">
            <PricingSimulator currency={currency} />
          </div>
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
