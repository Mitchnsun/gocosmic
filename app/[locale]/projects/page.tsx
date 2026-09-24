import type { Metadata } from 'next';
import { createTranslator, NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import { buildProjectCards, FilterableProjectGrid } from '@/components/ProjectGrid';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });

  const title = t('projectsList.meta.title');
  const description = t('projectsList.meta.description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects'),
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

export default async function Projects() {
  const t = await getTranslations('projectsList');
  const locale = await getLocale();
  const messages = await getMessages();
  const projects = buildProjectCards(t);

  return (
    <div className="bg-void text-ghost">
      <section aria-labelledby="projects-intro" className={cn('pb-0', SECTION_Y)}>
        <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
          <SectionHeading
            level={1}
            eyebrow={t('eyebrow', { count: String(projects.length).padStart(2, '0') })}
            title={t.rich('title', { em })}
            titleId="projects-intro"
            lead={t('subtitle')}
          />
          <NextIntlClientProvider locale={locale} messages={messages}>
            <FilterableProjectGrid projects={projects} />
          </NextIntlClientProvider>
        </div>
      </section>

      <CTAFinal
        id="projects-cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.button')}
        ctaHref="/contact"
        accentColor="aerospace"
        tone="sober"
      />
    </div>
  );
}
