import { CodeBracketIcon, SparklesIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { ContentSection } from '@/components/ContentSection';
import PageHero from '@/components/PageHero';
import { PricingTeaser } from '@/components/PricingTeaser';
import { OFFER_DEFINITIONS, ServiceDetail } from '@/components/ServiceDetail';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
import { getOgImages } from '@/lib/og';
import { getCurrency } from '@/lib/region';
import { getRegion } from '@/lib/region.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'offers' });

  const title = t('meta.title');
  const description = t('meta.description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/offers'),
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

/** Icons per offer anchor — kept out of the shared definitions so the
 *  constants file stays free of JSX. */
const OFFER_ICONS: Record<string, ReactNode> = {
  'solo-developer': <CodeBracketIcon className="size-5" aria-hidden="true" />,
  'developer-designer': <SparklesIcon className="size-5" aria-hidden="true" />,
  'team-developers': <UserGroupIcon className="size-5" aria-hidden="true" />,
};

const linkClassName =
  'text-aerospace hover:text-aerospace/80 focus-visible:ring-aerospace rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none';

export default async function Offers() {
  const t = await getTranslations('offers');
  const subject = encodeURIComponent(t('cta.email_subject'));
  const locale = await getLocale();
  const messages = await getMessages();
  const currency = getCurrency(await getRegion());
  const total = OFFER_DEFINITIONS.length;

  return (
    <div className="bg-void text-ghost relative">
      <PageHero
        id="offers-hero"
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('subtitle')}
        cta={{ text: t('hero.cta'), href: '/contact' }}
        secondaryCta={{ text: t('hero.secondary'), href: '/pricing' }}
      />

      <div className="m-auto flex max-w-7xl flex-col gap-10 p-4 sm:p-6 lg:p-8">
        {OFFER_DEFINITIONS.map((definition, position) => (
          <ServiceDetail
            key={definition.anchor}
            id={definition.anchor}
            accent={definition.accent}
            icon={OFFER_ICONS[definition.anchor]}
            index={`${String(position + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
            title={t(`${definition.key}.title`)}
            subtitle={t(`${definition.key}.subtitle`)}
            description={t(`${definition.key}.description`)}
            groups={definition.groups.map((group) => ({
              label: t(`${definition.key}.${group.key}.title`),
              items: group.items.map((item) => t(`${definition.key}.${group.key}.items.${item}`)),
            }))}
          />
        ))}

        <NextIntlClientProvider locale={locale} messages={messages}>
          <PricingTeaser currency={currency} />
        </NextIntlClientProvider>

        <ContentSection id="offers-cta" eyebrow={t('cta.eyebrow')} title={t('cta.title')} lead={t('cta.description')}>
          <a
            href={`mailto:prospect@gocosmic.dev?subject=${subject}`}
            className={cn(
              buttonVariants({ variant: 'aerospace' }),
              'w-fit py-3 transition-transform hover:scale-105 motion-reduce:scale-100! motion-reduce:transition-none!'
            )}>
            {t('cta.button')}
          </a>
          <p className="text-ghost/55 mt-6 text-sm">{t('cta.contact_info')}</p>
          <p className="text-ghost/55 mt-2 max-w-2xl text-sm">
            {t('cta.privacy_notice')}{' '}
            <Link href="/privacy" className={linkClassName}>
              {t('cta.privacy_link')}
            </Link>
            .
          </p>
        </ContentSection>
      </div>
    </div>
  );
}
