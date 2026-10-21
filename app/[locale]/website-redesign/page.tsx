import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { formatReleaseDate, PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { ContentPage, ContentPageProjects, formatCounter, SourceList, TermList } from '@/components/ContentPage';
import { ContentSection } from '@/components/ContentSection';
import { freeMockupNote } from '@/components/FreeMockup';
import ServiceSeo from '@/components/JsonLd/ServiceSeo';
import { formatStartingPrice } from '@/components/PricingSimulator/PricingSimulator.utils';
import { buildProjectCards } from '@/components/ProjectGrid';
import { WEBSITE_REDESIGN } from '@/data/content-pages';
import { ghostPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/website-redesign';
const SECTION_COUNT = 4;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const counter = (position: number) => formatCounter(position, SECTION_COUNT);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'websiteRedesign.meta' });

  return buildPageMetadata({ locale, routeKey: ROUTE, title: t('title'), description: t('description') });
}

/** Website redesign, in French only: a free review first, then the two paths, leaving Wix or WordPress, redirects. */
export default async function WebsiteRedesign({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('websiteRedesign');
  const tLinks = await getTranslations('contentPages');
  const tNav = await getTranslations('navigation');
  const tHome = await getTranslations('homepage');
  const price = formatStartingPrice(locale);
  const cards = buildProjectCards(await getTranslations('projectsList'));
  const projects = WEBSITE_REDESIGN.projects.flatMap((slug) => cards.filter((card) => card.slug === slug));
  const { year, latestRelease } = PROJECTS_BY_SLUG.coachnpulse;

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
        related={['pricing', 'services']}
        cta={{
          headline: t('cta.title'),
          description: t('cta.description'),
          button: t('cta.button'),
          href: '/contact',
          note: freeMockupNote(tHome),
        }}>
        <ContentSection
          id="start"
          eyebrow={t('start.eyebrow')}
          index={counter(1)}
          title={t('start.title')}
          lead={t('start.lead')}>
          <TermList
            items={[
              { term: t('start.audit'), description: t('start.audit_text') },
              { term: t('start.mockup'), description: t('start.mockup_text') },
            ]}
          />
        </ContentSection>

        <ContentSection
          id="paths"
          eyebrow={t('paths.eyebrow')}
          index={counter(2)}
          title={t('paths.title')}
          lead={t('paths.lead')}>
          <div className="flex flex-col items-start gap-8">
            <TermList
              items={[
                { term: t('paths.keep'), description: t('paths.keep_text') },
                { term: t('paths.rebuild'), description: t('paths.rebuild_text', { price }) },
                { term: t('paths.custom'), description: t('paths.custom_text') },
              ]}
            />
            <Link href={{ pathname: '/services', hash: 'pricing' }} className={ghostPill()}>
              {tHome('pricing.all')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </ContentSection>

        <ContentSection
          id="leave"
          eyebrow={t('leave.eyebrow')}
          index={counter(3)}
          title={t('leave.title')}
          lead={t('leave.lead')}>
          <div className="flex flex-col gap-8">
            <TermList
              items={[
                { term: t('leave.wix_site'), description: t('leave.wix_site_text') },
                { term: t('leave.wix_domain'), description: t('leave.wix_domain_text') },
                { term: t('leave.wordpress'), description: t('leave.wordpress_text') },
              ]}
            />
            <p className="text-fg-2 max-w-3xl leading-relaxed">{t('leave.domain_note')}</p>
          </div>
        </ContentSection>

        <ContentSection
          id="redirects"
          eyebrow={t('redirects.eyebrow')}
          index={counter(4)}
          title={t('redirects.title')}
          lead={t('redirects.lead')}>
          <p className="text-fg-2 max-w-3xl leading-relaxed">{t('redirects.volume')}</p>
        </ContentSection>

        <ContentPageProjects
          id="projects"
          eyebrow={t('projects.eyebrow')}
          title={t.rich('projects.title', { em, year: String(year) })}
          lead={t('projects.lead', {
            version: latestRelease.version,
            date: formatReleaseDate(latestRelease.date, locale),
          })}
          projects={projects}
        />

        <SourceList
          consulted={WEBSITE_REDESIGN.sources.consulted}
          sources={WEBSITE_REDESIGN.sources.items.map(({ key, href }) => ({ label: t(`sources.${key}`), href }))}
        />
      </ContentPage>
      <ServiceSeo route={ROUTE} name={tLinks('links.website_redesign.label')} description={t('meta.description')} />
    </>
  );
}
