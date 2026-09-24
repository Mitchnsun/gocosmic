import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AudienceGrid } from '@/components/AudienceGrid';
import CTAFinal from '@/components/CTAFinal';
import HeroSection from '@/components/HeroSection';
import { OwnApps } from '@/components/OwnApps';
import { PricingColumns } from '@/components/PricingColumns';
import { buildPricingColumns } from '@/components/PricingColumns/PricingColumns.utils';
import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { formatAmount } from '@/components/PricingSimulator/PricingSimulator.utils';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { homepageSteps } from '@/components/ProcessTimeline/constants';
import { buildProjectCards, ProjectGrid } from '@/components/ProjectGrid';
import { SectionHeading } from '@/components/SectionHeading';
import { StudioIntro } from '@/components/StudioIntro';
import { WhyStudio } from '@/components/WhyStudio';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { getCurrency } from '@/lib/region';
import { getRegion } from '@/lib/region.server';

const AUDIENCES = ['artisans', 'associations', 'independents'] as const;
const REASONS = ['ownership', 'fast', 'person', 'grows'] as const;
const FACTS = ['price', 'reply', 'contact', 'area'] as const;
/** Projects featured on the homepage; the full list lives on /projects. */
const HOME_PROJECT_COUNT = 3;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default async function Home() {
  const t = await getTranslations('homepage');
  const tPricing = await getTranslations('pricing.columns');
  const tProjects = await getTranslations('projectsList');
  const locale = await getLocale();
  const region = await getRegion();
  const startingPrice = formatAmount(BASE_PRICE, getCurrency(region));

  const processSteps = homepageSteps.map((step) => ({
    ...step,
    label: t(`process.${step.id}.label`),
    title: t(`process.${step.id}.title`),
    description: t(`process.${step.id}.description`),
  }));
  const pricing = buildPricingColumns(tPricing, region, locale);
  const projects = buildProjectCards(tProjects).slice(0, HOME_PROJECT_COUNT);

  return (
    <div className="bg-void text-ghost">
      <HeroSection
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        endWords={t.raw('hero.endWords') as string[]}
        subtitle={t('hero.subtitle')}
        cta={{ text: t('hero.cta'), href: '/free-mockup' }}
        secondaryCta={{ text: t('hero.secondary'), href: { pathname: '/services', hash: 'pricing' } }}
        facts={FACTS.map((fact) => ({
          highlight: t(`hero.facts.${fact}.highlight`, { price: startingPrice }),
          text: t(`hero.facts.${fact}.text`),
        }))}
      />

      <AudienceGrid
        eyebrow={t('audience.eyebrow')}
        title={t.rich('audience.title', { em })}
        items={AUDIENCES.map((audience) => ({
          title: t(`audience.items.${audience}.title`),
          description: t(`audience.items.${audience}.description`),
        }))}
      />

      <WhyStudio
        eyebrow={t('why.eyebrow')}
        title={t.rich('why.title', { em })}
        lead={t('why.lead')}
        reasons={REASONS.map((reason) => ({
          title: t(`why.reasons.${reason}.title`),
          description: t(`why.reasons.${reason}.description`),
        }))}
      />

      <div className={CONTAINER}>
        <ProcessTimeline
          id="process"
          eyebrow={t('process.eyebrow')}
          title={t.rich('process.title', { em })}
          subtitle={t('process.subtitle')}
          steps={processSteps}
          layout="horizontal"
          pathDuration={2000}
          staggerDelay={200}
        />
      </div>

      <PricingColumns
        className="border-ghost/8 border-t"
        eyebrow={tPricing('eyebrow')}
        title={tPricing('title')}
        subscription={pricing.subscription}
        project={pricing.project}
      />

      <section id="projects" aria-labelledby="projects-heading" className={cn('border-ghost/8 border-t', SECTION_Y)}>
        <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={t('projects.eyebrow')}
              title={t.rich('projects.title', { em })}
              titleId="projects-heading"
            />
            <Link href="/projects" className={ghostPill('h-11 text-[15px]')}>
              {t('projects.all')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>

      <OwnApps
        eyebrow={t('apps.eyebrow')}
        title={t.rich('apps.title', { em })}
        lead={t('apps.lead')}
        app={{
          name: t('apps.daily_fortune.name'),
          badge: t('apps.daily_fortune.badge'),
          description: t('apps.daily_fortune.description'),
          linkLabel: t('apps.daily_fortune.link'),
          href: '/projects/daily-fortune',
          icon: { src: '/projects/daily-fortune/app-icon.png', alt: t('apps.daily_fortune.icon_alt') },
        }}
      />

      <StudioIntro
        eyebrow={t('studio.eyebrow')}
        title={t.rich('studio.title', { em })}
        paragraphs={t.raw('studio.paragraphs') as string[]}
        zones={t.raw('studio.zones') as string[]}
      />

      <CTAFinal
        id="cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        note={t.rich('cta.freeMockup', {
          link: (chunks) => (
            <Link
              href="/free-mockup"
              className="text-ghost/70 hover:text-ghost underline underline-offset-4 transition">
              {chunks}
            </Link>
          ),
        })}
        ctaText={t('cta.button')}
        ctaHref="/contact"
        accentColor="aerospace"
        starfieldWarpSpeed={0.8}
        warpOnHover
      />
    </div>
  );
}
