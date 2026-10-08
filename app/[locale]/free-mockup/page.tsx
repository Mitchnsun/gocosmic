import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { FreeMockupPitch } from '@/components/FreeMockup';
import { FreeMockupForm } from '@/components/FreeMockupForm';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  return buildPageMetadata({
    locale,
    routeKey: '/free-mockup',
    title: t('title'),
    description: t('description'),
  });
}

export default async function FreeMockup() {
  const t = await getTranslations('freeMockup');
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <div className="bg-bg text-fg relative isolate pt-10" style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="m-auto grid max-w-6xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-14 lg:px-8">
          <FreeMockupPitch />
          <section
            aria-labelledby="free-mockup-form-heading"
            className="flex w-full flex-col gap-4 lg:sticky lg:top-24">
            <h2 id="free-mockup-form-heading" className="font-display text-xl font-semibold sm:text-2xl">
              {t('form.heading')}
            </h2>
            <p className="text-fg-2 text-sm">{t('form.lead')}</p>
            <FreeMockupForm />
          </section>
        </div>
      </NextIntlClientProvider>
    </div>
  );
}
