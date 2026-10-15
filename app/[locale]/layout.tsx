import type { Metadata } from 'next';
import { DM_Sans, Space_Grotesk, Space_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { CookieConsent, CookieConsentProvider } from '@/components/CookieConsent';
import { CosmicCursorGate } from '@/components/CosmicCursor';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import LocalBusinessSeo from '@/components/JsonLd/LocalBusinessSeo';
import WebsiteSeo from '@/components/JsonLd/WebsiteSeo';
import { StatusBar } from '@/components/StatusBar';
import { ThemeColorBoot, ThemeProvider } from '@/components/Theme';
import { getClientMessages } from '@/i18n/client-messages';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';
import { getRegion } from '@/lib/region';
import { buildPageMetadata } from '@/lib/seo';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

// Regular only: no text is set in bold monospace.
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

/** Every locale is rendered at build time and served from the CDN cache. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const { title, description, openGraph, twitter } = await buildPageMetadata({
    locale,
    routeKey: '/',
    title: t('title'),
    description: t('description'),
  });

  // Fallback for the 404, as every route sets its own metadata: without the homepage's canonical
  // URL, hreflang links and Open Graph URL, which a missing page must not claim.
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    openGraph: { ...openGraph, url: undefined },
    twitter,
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
  setRequestLocale(locale);

  const region = getRegion(locale);
  // Only what the header, footer, theme switch and cookie banner read in the browser.
  const messages = await getClientMessages(['navigation', 'theme', 'cookieConsent']);

  return (
    // next-themes sets data-theme on <html> before hydration, hence suppressHydrationWarning.
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${spaceMono.variable}`}
      suppressHydrationWarning>
      <body className="bg-bg">
        <ThemeColorBoot />
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            <CookieConsentProvider>
              <CosmicCursorGate />
              <StatusBar region={region} />
              <Header region={region} />
              <main id="main-content">{children}</main>
              <Footer region={region} />
              <WebsiteSeo />
              <CookieConsent />
              <LocalBusinessSeo locale={locale} />
            </CookieConsentProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
