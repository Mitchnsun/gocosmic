import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { CookieConsent } from '@/components/CookieConsent';
import { CosmicCursor } from '@/components/CosmicCursor';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import LocalBusinessSeo from '@/components/JsonLd/LocalBusinessSeo';
import WebsiteSeo from '@/components/JsonLd/WebsiteSeo';
import { StatusBar } from '@/components/StatusBar';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';
import { getOgImages } from '@/lib/og';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body',
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  const languages = Object.fromEntries(routing.locales.map((localeCode) => [localeCode, `${SITE_URL}/${localeCode}/`]));

  const title = t('title');
  const description = t('description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `/${locale}/`,
      languages: {
        ...languages,
        'x-default': `${SITE_URL}/${routing.defaultLocale}/`,
      },
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
    <html lang={locale || 'en'} className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-slate-950">
        <NextIntlClientProvider>
          <CosmicCursor />
          <StatusBar />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <WebsiteSeo />
          <CookieConsent />
          <LocalBusinessSeo locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
