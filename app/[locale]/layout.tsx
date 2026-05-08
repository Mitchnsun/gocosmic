import { Analytics } from '@vercel/analytics/next';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import WebsiteSeo from '@/components/JsonLd/WebsiteSeo';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '800'],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const languages = Object.fromEntries(routing.locales.map((localeCode) => [localeCode, `${SITE_URL}/${localeCode}/`]));

  return {
    title: t('title'),
    description: t('description'),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ...languages,
        'x-default': `${SITE_URL}/${routing.defaultLocale}/`,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale || 'en'}>
      <body className={`${poppins.className} bg-slate-950`}>
        <NextIntlClientProvider>
          <Header />
          <div className="mt-16">{children}</div>
          <Footer />
          <WebsiteSeo />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
