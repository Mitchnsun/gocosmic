import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { FreeMockupPitch } from '@/components/FreeMockup';
import { FreeMockupForm } from '@/components/FreeMockupForm';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });
  const title = t('meta.title');
  const description = t('meta.description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/free-mockup'),
    },
    openGraph: {
      title,
      description,
      images: [og],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitter],
    },
  };
}

export default async function FreeMockup() {
  const t = await getTranslations('freeMockup');
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <div
      className="bg-void text-ghost relative isolate pt-10"
      style={{ minHeight: 'calc(100vh - var(--header-height))' }}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="m-auto grid max-w-6xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-14 lg:px-8">
          <FreeMockupPitch />
          <section
            aria-labelledby="free-mockup-form-heading"
            className="flex w-full flex-col gap-4 lg:sticky lg:top-24">
            <h2 id="free-mockup-form-heading" className="font-display text-xl font-semibold sm:text-2xl">
              {t('form.heading')}
            </h2>
            <p className="text-ghost/55 text-sm">{t('form.lead')}</p>
            <FreeMockupForm />
          </section>
        </div>
      </NextIntlClientProvider>
    </div>
  );
}
