import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AccentList } from '@/components/AccentList';
import { ContentPage, ContentPageProjects, formatCounter } from '@/components/ContentPage';
import { ContentSection } from '@/components/ContentSection';
import ServiceSeo from '@/components/JsonLd/ServiceSeo';
import { buildProjectCards } from '@/components/ProjectGrid';
import { APP_DEVELOPMENT } from '@/data/content-pages';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/app-development';
const SECTION_COUNT = 3;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const counter = (position: number) => formatCounter(position, SECTION_COUNT);
const values = (raw: unknown) => Object.values(raw as Record<string, string>);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'appDevelopment.meta' });

  return buildPageMetadata({ locale, routeKey: ROUTE, title: t('title'), description: t('description') });
}

/** App development, in French only: what the studio builds, how a quoted project runs, and its own apps. */
export default async function AppDevelopment({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('appDevelopment');
  const tLinks = await getTranslations('contentPages');
  const tNav = await getTranslations('navigation');
  const tProjects = await getTranslations('projectsList');
  const cards = buildProjectCards(tProjects);
  const projects = APP_DEVELOPMENT.projects.flatMap((slug) => cards.filter((card) => card.slug === slug));

  return (
    <>
      <ContentPage
        breadcrumb={[
          { label: tNav('services'), href: '/services' },
          { label: tLinks('links.app_development.label'), href: ROUTE },
        ]}
        eyebrow={t('intro.eyebrow')}
        title={t.rich('intro.title', { em })}
        lead={t('intro.lead')}
        related={['projects', 'services']}
        cta={{
          headline: t('cta.title'),
          description: t('cta.description'),
          button: t('cta.button'),
          href: '/contact',
        }}>
        <ContentSection
          id="builds"
          eyebrow={t('builds.eyebrow')}
          index={counter(1)}
          title={t('builds.title')}
          lead={t('builds.lead')}>
          <AccentList items={values(t.raw('builds.points'))} accent="jungle" ariaLabel={t('builds.title')} />
        </ContentSection>

        <ContentSection
          id="how"
          eyebrow={t('how.eyebrow')}
          index={counter(2)}
          title={t('how.title')}
          lead={t('how.lead')}>
          <AccentList items={values(t.raw('how.points'))} accent="jungle" ariaLabel={t('how.title')} />
        </ContentSection>

        <ContentSection
          id="guidance"
          eyebrow={t('guidance.eyebrow')}
          index={counter(3)}
          title={t('guidance.title')}
          lead={t('guidance.lead')}>
          <AccentList items={values(t.raw('guidance.points'))} accent="jungle" ariaLabel={t('guidance.title')} />
        </ContentSection>

        <ContentPageProjects
          id="projects"
          eyebrow={t('projects.eyebrow')}
          title={t.rich('projects.title', { em })}
          lead={t('projects.lead')}
          projects={projects}
        />
      </ContentPage>
      <ServiceSeo route={ROUTE} name={tLinks('links.app_development.label')} description={t('meta.description')} />
    </>
  );
}
