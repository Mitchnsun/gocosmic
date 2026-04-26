import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { PricingSimulator } from '@/components/PricingSimulator';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function Pricing() {
  const t = useTranslations('pricing');

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-3xl flex-col items-center gap-10 px-4 pb-12">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Simulator */}
        <div className="w-full">
          <PricingSimulator />
        </div>
      </main>
    </div>
  );
}
