import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { ContactChannels } from '@/components/ContactChannels';
import { ContactForm } from '@/components/ContactForm';
import { ContentSection } from '@/components/ContentSection';
import PageHero from '@/components/PageHero';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
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
      canonical: getCanonicalUrl(locale, '/contact'),
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

export default async function Contact() {
  const t = await getTranslations('contact');
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <div className="bg-void text-ghost relative">
      <PageHero id="contact-hero" eyebrow={t('eyebrow')} title={t('title')} lead={t('subtitle')} />

      <div className="m-auto flex max-w-7xl flex-col gap-10 p-4 sm:p-6 lg:p-8">
        {/* Contact form */}
        <ContentSection
          id="brief"
          eyebrow={t('form.eyebrow')}
          title={t('form.title')}
          lead={t('form.description')}
          flat>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <ContactForm variant="page" />
          </NextIntlClientProvider>
        </ContentSection>

        {/* Direct email channels */}
        <ContentSection
          id="direct"
          eyebrow={t('direct.eyebrow')}
          title={t('direct.title')}
          lead={t('direct.description')}
          flat>
          <ContactChannels ariaLabel={t('direct.title')} />
        </ContentSection>

        <p className="border-ghost/8 bg-ghost/[0.02] text-ghost/55 rounded-2xl border px-6 py-5 text-sm leading-7">
          {t('privacyNotice')}{' '}
          <Link
            href="/privacy"
            className="text-aerospace hover:text-aerospace/80 focus-visible:ring-aerospace rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none">
            {t('privacyLink')}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
