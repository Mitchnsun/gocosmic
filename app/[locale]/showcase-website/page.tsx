import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AccentList } from '@/components/AccentList';
import { ContentPage, ContentPageProjects, TermList } from '@/components/ContentPage';
import { ContentSection } from '@/components/ContentSection';
import ServiceSeo from '@/components/JsonLd/ServiceSeo';
import { BASE_PRICE, FORMULA_INCLUDES, FORMULA_PRICES } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { buildProjectCards } from '@/components/ProjectGrid';
import { SHOWCASE_WEBSITE } from '@/data/content-pages';
import { ghostPill } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { CODE_HANDOVER_MONTHS } from '@/lib/pricing/offers';
import { getCurrency, getRegion } from '@/lib/region';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/showcase-website';
const SECTION_COUNT = 4;

const em = (chunks: ReactNode) => <em>{chunks}</em>;
const counter = (position: number) => `0${position} / 0${SECTION_COUNT}`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'showcaseWebsite.meta' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('title'),
    description: t('description', { price: formatAmount(BASE_PRICE, getCurrency(getRegion(locale)), locale) }),
  });
}

/** Showcase website, in French only: what such a site shows, what is included, what it costs and how long it takes. */
export default async function ShowcaseWebsite({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('showcaseWebsite');
  const tLinks = await getTranslations('contentPages');
  const tNav = await getTranslations('navigation');
  const tPricing = await getTranslations('pricing.builder');
  const tServices = await getTranslations('services');
  const region = getRegion(locale);
  const price = (amount: number) => formatAmount(amount, getCurrency(region), locale);
  const cards = buildProjectCards(await getTranslations('projectsList'));
  const projects = SHOWCASE_WEBSITE.projects.flatMap((slug) => cards.filter((card) => card.slug === slug));

  return (
    <>
      <ContentPage
        breadcrumb={[
          { label: tNav('services'), href: '/services' },
          { label: tLinks('links.showcase_website.label'), href: ROUTE },
        ]}
        eyebrow={t('intro.eyebrow')}
        title={t.rich('intro.title', { em })}
        lead={t('intro.lead')}
        related={{
          eyebrow: tLinks('related.eyebrow'),
          title: tLinks('related.title'),
          pages: [
            {
              title: tLinks('links.pricing.label'),
              description: tLinks('links.pricing.description'),
              href: '/pricing',
            },
            {
              title: tLinks('links.projects.label'),
              description: tLinks('links.projects.description'),
              href: '/projects',
            },
          ],
        }}
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
          <AccentList
            items={Object.values(t.raw('shows.points') as Record<string, string>)}
            accent="jungle"
            columns={2}
            ariaLabel={t('shows.title')}
          />
        </ContentSection>

        <ContentSection
          id="price"
          eyebrow={t('price.eyebrow')}
          index={counter(2)}
          title={t('price.title')}
          lead={t('price.lead', { price: price(BASE_PRICE), selfServicePrice: price(FORMULA_PRICES.self_service) })}>
          <div className="flex flex-col items-start gap-6">
            <AccentList
              label={t('price.included')}
              labelAs="h3"
              items={FORMULA_INCLUDES.managed.map((key) => tPricing(`base.includes.${key}`))}
              accent="jungle"
              columns={2}
            />
            <p className="text-fg-2 text-sm">{t('price.note')}</p>
            <Link href="/pricing" className={ghostPill()}>
              {t('price.action')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </ContentSection>

        <ContentSection
          id="options"
          eyebrow={t('options.eyebrow')}
          index={counter(3)}
          title={t('options.title')}
          lead={t('options.lead')}>
          <TermList
            items={SHOWCASE_WEBSITE.options.map((option) => ({
              term: tPricing(`options.${option}.label`),
              description: tPricing(`options.${option}.hint`),
            }))}
          />
        </ContentSection>

        <ContentSection id="timing" eyebrow={t('timing.eyebrow')} index={counter(4)} title={t('timing.title')}>
          <TermList
            items={[
              { term: t('timing.delay'), description: tServices('faq.items.timing.answer') },
              {
                term: t('timing.ownership'),
                description: t('timing.ownership_text', { months: String(CODE_HANDOVER_MONTHS) }),
              },
            ]}
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
        name={tLinks('links.showcase_website.label')}
        description={t('meta.description', { price: price(BASE_PRICE) })}
        offer={{ price: BASE_PRICE, region }}
      />
    </>
  );
}
