import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { toBookingEmbedUrl } from '@/components/BookingEmbed';
import { ContactDetails } from '@/components/ContactDetails';
import { ContactPanel } from '@/components/ContactPanel';
import { SectionHeading } from '@/components/SectionHeading';
import { AVAILABILITY } from '@/components/StatusBar/StatusBar.constants';
import { formatStartMonth } from '@/components/StatusBar/StatusBar.utils';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
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

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default async function Contact() {
  const t = await getTranslations('contact');
  const tStatus = await getTranslations('status_bar');
  const locale = await getLocale();
  const messages = await getMessages();
  const { status, startMonth } = AVAILABILITY;
  const month = formatStartMonth(startMonth, locale);

  return (
    <div className="bg-void text-ghost">
      <section aria-labelledby="contact-heading" className={SECTION_Y}>
        <div className={cn(CONTAINER, 'grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]')}>
          <div className="flex flex-col gap-8">
            <SectionHeading
              level={1}
              eyebrow={t('eyebrow')}
              title={t.rich('title', { em })}
              titleId="contact-heading"
              titleClassName="text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[1.02]"
              lead={t('lead')}
            />
            <ContactDetails
              ariaLabel={t('details.aria_label')}
              details={[
                { label: t('details.email_label'), value: 'contact@gocosmic.dev', href: 'mailto:contact@gocosmic.dev' },
                {
                  label: t('details.support_label'),
                  value: 'support@gocosmic.dev',
                  href: 'mailto:support@gocosmic.dev',
                },
                { label: t('details.where_label'), value: t('details.where') },
              ]}
              status={`${tStatus(`${status}.label`)} · ${tStatus(`${status}.detail`, { month })}`}
              available={status === 'available'}
            />
          </div>

          <div className="flex flex-col gap-4">
            <NextIntlClientProvider locale={locale} messages={messages}>
              <ContactPanel bookingUrl={toBookingEmbedUrl(process.env.NEXT_PUBLIC_GCAL_BOOKING_URL)} />
            </NextIntlClientProvider>
            <p className="text-ghost/45 px-2 text-sm leading-relaxed">
              {t('privacyNotice')}{' '}
              <Link
                href="/privacy"
                className="text-ghost/70 hover:text-ghost focus-visible:ring-aerospace/70 rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none">
                {t('privacyLink')}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
