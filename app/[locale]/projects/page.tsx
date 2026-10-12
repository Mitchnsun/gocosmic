import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';
import ProjectsListSeo from '@/components/JsonLd/ProjectsListSeo';
import { buildProjectCards, FilterableProjectGrid } from '@/components/ProjectGrid';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP, SECTION_Y } from '@/design-system/pill';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projectsList' });

  return buildPageMetadata({
    locale,
    routeKey: '/projects',
    title: t('meta.title'),
    description: t('meta.description'),
  });
}

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default async function Projects() {
  const t = await getTranslations('projectsList');
  const locale = await getLocale();
  const messages = await getMessages();
  const projects = buildProjectCards(t);

  return (
    <div className="bg-bg text-fg">
      <section aria-labelledby="projects-intro" className={cn(SECTION_Y, PAGE_TOP)}>
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
        tone="sober"
      />
      <ProjectsListSeo />
      <BreadcrumbSeo route="/projects" />
    </div>
  );
}
