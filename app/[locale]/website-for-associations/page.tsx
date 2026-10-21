import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AccentList } from '@/components/AccentList';
import { ContentPage, ContentPageProjects, formatCounter, PlanExample, TermList } from '@/components/ContentPage';
import { ContentSection } from '@/components/ContentSection';
import ServiceSeo from '@/components/JsonLd/ServiceSeo';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatStartingPrice } from '@/components/PricingSimulator/PricingSimulator.utils';
import { buildProjectCards } from '@/components/ProjectGrid';
import { WEBSITE_FOR_ASSOCIATIONS } from '@/data/content-pages';
import { getRegion } from '@/lib/region';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/website-for-associations';
const SECTION_COUNT = 4;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const counter = (position: number) => formatCounter(position, SECTION_COUNT);
const keys = (raw: unknown) => Object.keys(raw as Record<string, unknown>);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'websiteForAssociations.meta' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('title'),
    description: t('description', { price: formatStartingPrice(locale) }),
  });
}

/** Website for associations and clubs, in French only: what it gathers, the features, an example, the questions. */
export default async function WebsiteForAssociations({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('websiteForAssociations');
  const tLinks = await getTranslations('contentPages');
  const price = formatStartingPrice(locale);
  const tNav = await getTranslations('navigation');
  const cards = buildProjectCards(await getTranslations('projectsList'));
  const projects = WEBSITE_FOR_ASSOCIATIONS.projects.flatMap((slug) => cards.filter((card) => card.slug === slug));

  return (
    <>
      <ContentPage
        breadcrumb={[
          { label: tNav('services'), href: '/services' },
          { label: t('breadcrumb'), href: ROUTE },
        ]}
        eyebrow={t('intro.eyebrow')}
        title={t.rich('intro.title', { em })}
        lead={t('intro.lead')}
        related={['projects', 'pricing']}
        cta={{
          headline: t('cta.title'),
          description: t('cta.description'),
          button: t('cta.button'),
          href: '/free-mockup',
        }}>
        <ContentSection
          id="needs"
          eyebrow={t('needs.eyebrow')}
          index={counter(1)}
          title={t('needs.title')}
          lead={t('needs.lead')}>
          <AccentList
            items={Object.values(t.raw('needs.points') as Record<string, string>)}
            accent="jungle"
            columns={2}
          />
        </ContentSection>

        <ContentSection
          id="features"
          eyebrow={t('features.eyebrow')}
          index={counter(2)}
          title={t('features.title')}
          lead={t('features.lead')}>
          <TermList
            items={keys(t.raw('features.items')).map((feature) => ({
              term: t(`features.items.${feature}.term`),
              description: t(`features.items.${feature}.description`),
            }))}
          />
        </ContentSection>

        <ContentSection
          id="example"
          eyebrow={t('example.eyebrow')}
          index={counter(3)}
          title={t('example.title')}
          lead={t('example.lead')}>
          <PlanExample example={WEBSITE_FOR_ASSOCIATIONS.example} />
        </ContentSection>

        <ContentSection id="questions" eyebrow={t('questions.eyebrow')} index={counter(4)} title={t('questions.title')}>
          <TermList
            items={keys(t.raw('questions.items')).map((question) => ({
              term: t(`questions.items.${question}.question`),
              description: t(`questions.items.${question}.answer`, { price }),
            }))}
          />
        </ContentSection>

        <ContentPageProjects
          id="projects"
          eyebrow={t('projects.eyebrow')}
          title={t.rich('projects.title', { em })}
          lead={t('projects.lead')}
          projects={projects}
        />
      </ContentPage>
      <ServiceSeo
        route={ROUTE}
        name={tLinks('links.website_for_associations.label')}
        description={t('meta.description', { price })}
        offer={{ price: BASE_PRICE, region: getRegion(locale) }}
      />
    </>
  );
}
