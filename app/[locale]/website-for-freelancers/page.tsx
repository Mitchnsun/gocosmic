import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AccentList } from '@/components/AccentList';
import {
  buildOptionTerms,
  ContentPage,
  ContentPageProjects,
  formatCounter,
  PlanExample,
  TermList,
} from '@/components/ContentPage';
import { ContentSection } from '@/components/ContentSection';
import { formatStartingPrice } from '@/components/PricingSimulator/PricingSimulator.utils';
import { buildProjectCards } from '@/components/ProjectGrid';
import { WEBSITE_FOR_FREELANCERS } from '@/data/content-pages';
import { getRegion } from '@/lib/region';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/website-for-freelancers';
const SECTION_COUNT = 4;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const counter = (position: number) => formatCounter(position, SECTION_COUNT);
const values = (raw: unknown) => Object.values(raw as Record<string, string>);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'websiteForFreelancers.meta' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('title'),
    description: t('description', { price: formatStartingPrice(locale) }),
  });
}

/** Website for freelancers and liberal professions, in French only: what it shows, starting small, the options. */
export default async function WebsiteForFreelancers({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('websiteForFreelancers');
  const tNav = await getTranslations('navigation');
  const tPricing = await getTranslations('pricing.builder');
  const cards = buildProjectCards(await getTranslations('projectsList'));
  const projects = WEBSITE_FOR_FREELANCERS.projects.flatMap((slug) => cards.filter((card) => card.slug === slug));

  return (
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
        id="shows"
        eyebrow={t('shows.eyebrow')}
        index={counter(1)}
        title={t('shows.title')}
        lead={t('shows.lead')}>
        <div className="flex flex-col gap-6">
          <AccentList items={values(t.raw('shows.points'))} accent="jungle" columns={2} ariaLabel={t('shows.title')} />
          <p className="text-fg-2 max-w-3xl text-sm">{t('shows.ethics')}</p>
        </div>
      </ContentSection>

      <ContentSection
        id="grow"
        eyebrow={t('grow.eyebrow')}
        index={counter(2)}
        title={t('grow.title')}
        lead={t('grow.lead', { price: formatStartingPrice(locale) })}>
        <AccentList items={values(t.raw('grow.points'))} accent="jungle" ariaLabel={t('grow.title')} />
      </ContentSection>

      <ContentSection
        id="options"
        eyebrow={t('features.eyebrow')}
        index={counter(3)}
        title={t('features.title')}
        lead={t('features.lead')}>
        <TermList items={buildOptionTerms(tPricing, WEBSITE_FOR_FREELANCERS.options, getRegion(locale))} />
      </ContentSection>

      <ContentSection
        id="example"
        eyebrow={t('example.eyebrow')}
        index={counter(4)}
        title={t('example.title')}
        lead={t('example.lead')}>
        <PlanExample example={WEBSITE_FOR_FREELANCERS.example} />
      </ContentSection>

      <ContentPageProjects
        id="projects"
        eyebrow={t('projects.eyebrow')}
        title={t.rich('projects.title', { em })}
        lead={t('projects.lead')}
        projects={projects}
      />
    </ContentPage>
  );
}
