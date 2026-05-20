import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { PricingSimulator } from '@/components/PricingSimulator';

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

  return (
    <div className="text-ghost relative pt-10" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <main className="m-auto flex max-w-5xl flex-col items-center gap-10 px-4 pb-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Simulator */}
        <div className="w-full">
          <NextIntlClientProvider locale={locale} messages={messages}>
            <PricingSimulator />
          </NextIntlClientProvider>
        </div>
      </main>
    </div>
  );
}
