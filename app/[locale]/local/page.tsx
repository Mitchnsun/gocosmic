import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AudienceGrid } from '@/components/AudienceGrid';
import CTAFinal from '@/components/CTAFinal';
import { buildHeroFacts, FactsLine } from '@/components/FactsLine';
import { freeMockupNote } from '@/components/FreeMockup';
import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { buildProjectCards, ProjectGrid } from '@/components/ProjectGrid';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, PAGE_TOP, primaryPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { getCurrency } from '@/lib/region';
import { getRegion } from '@/lib/region.server';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'local' });

  return buildPageMetadata({
    locale,
    routeKey: '/local',
    title: t('meta.title'),
    description: t('meta.description'),
  });
}

const AUDIENCES = ['artisans', 'associations', 'independents'] as const;
const ZONES = ['geneva', 'romandy', 'annecy', 'remote'] as const;
/** Projects featured on this page; the full list lives on /projects. */
const PROJECT_COUNT = 3;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Local landing page for searches around Geneva and Annecy; the lead follows the visitor's region. */
export default async function LocalPage() {
  const t = await getTranslations('local');
  const tProjects = await getTranslations('projectsList');
  const tHome = await getTranslations('homepage');
  const locale = await getLocale();
  const region = await getRegion();
  const startingPrice = formatAmount(BASE_PRICE, getCurrency(region), locale);
  const projects = buildProjectCards(tProjects).slice(0, PROJECT_COUNT);

  return (
    <div className="bg-bg text-fg">
      <section aria-labelledby="local-intro" className={cn(PAGE_TOP, 'pb-[clamp(3rem,6vw,4.5rem)]')}>
        <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
          <SectionHeading
            level={1}
            eyebrow={t('intro.eyebrow')}
            title={t.rich('intro.title', { em })}
            titleId="local-intro"
            lead={t(`intro.lead.${region}`)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contact" className={primaryPill()}>
              {t('intro.primary')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/services" className={ghostPill()}>
              {t('intro.secondary')}
            </Link>
          </div>
          <FactsLine facts={buildHeroFacts(tHome, region, startingPrice)} />
        </div>
      </section>

      <AudienceGrid
        id="zones"
        eyebrow={t('zones.eyebrow')}
        title={t.rich('zones.title', { em })}
        items={ZONES.map((zone) => ({
          title: t(`zones.items.${zone}.title`),
          description: t(`zones.items.${zone}.description`),
        }))}
      />

      <AudienceGrid
        id="audience"
        eyebrow={tHome('audience.eyebrow')}
        title={tHome.rich('audience.title', { em })}
        items={AUDIENCES.map((audience) => ({
          title: tHome(`audience.items.${audience}.title`),
          description: tHome(`audience.items.${audience}.description`),
        }))}
      />

      <section aria-labelledby="local-projects" className={cn('border-line border-t', SECTION_Y)}>
        <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={t('projects.eyebrow')}
              title={t.rich('projects.title', { em })}
              titleId="local-projects"
            />
            <Link href="/projects" className={ghostPill('h-11 text-[15px]')}>
              {t('projects.all')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>

      <CTAFinal
        id="local-cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        note={freeMockupNote(tHome)}
        ctaText={t('cta.button')}
        ctaHref="/contact"
        tone="sober"
      />
      <BreadcrumbSeo route="/local" />
    </div>
  );
}
