import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';

import { AsciiMarquee } from '@/components/AsciiMarquee';
import CTAFinal from '@/components/CTAFinal';
import HeroSection from '@/components/HeroSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { homepageSteps } from '@/components/ProcessTimeline/constants';
import { PROJECT_DEFINITIONS, ProjectsShowcase } from '@/components/ProjectsShowcase';
import { ServicesGrid } from '@/components/ServicesGrid';
import { ZoneIntervention } from '@/components/ZoneIntervention';
import { getRegion } from '@/lib/region.server';

export default async function Home() {
  const t = await getTranslations('homepage');
  const locale = await getLocale();
  const messages = await getMessages();
  const region = await getRegion();
  const asciiLabels = t.raw('ascii_labels') as string[];

  const processSteps = homepageSteps.map((step) => ({
    ...step,
    label: t(`process.${step.id}.label`),
    title: t(`process.${step.id}.title`),
    description: t(`process.${step.id}.description`),
  }));

  const projects = PROJECT_DEFINITIONS.map((def) => ({
    ...def,
    title: t(`projects.${def.id}.title`),
    tagline: t(`projects.${def.id}.tagline`),
    description: t(`projects.${def.id}.description`),
    tags: t.raw(`projects.${def.id}.tags`) as string[],
    image: { ...def.image, alt: t(`projects.${def.id}.imageAlt`) },
  }));

  return (
    <div className="text-ghost bg-void relative px-4 pt-4">
      <HeroSection
        title={t('hero.title')}
        endWords={t.raw('hero.endWords') as string[]}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        ctaHref="/journey"
        className="-m-4 mb-4"
      />

      <div className="relative z-10 m-auto max-w-7xl">
        <ProcessTimeline
          id="process"
          eyebrow={t('process.eyebrow')}
          title={t.rich('process.title', { em: (chunks) => <em>{chunks}</em> })}
          subtitle={t('process.subtitle')}
          steps={processSteps}
          layout="horizontal"
          pathDuration={2000}
          staggerDelay={200}
        />
      </div>
      <section className="relative z-10 m-auto mt-4 flex max-w-7xl flex-col items-center">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ServicesGrid />
        </NextIntlClientProvider>
      </section>

      <div className="relative z-10 m-auto max-w-7xl">
        <ProjectsShowcase
          id="projects"
          eyebrow={t('projects.eyebrow')}
          title={t.rich('projects.title', { em: (chunks) => <em>{chunks}</em> })}
          subtitle={t('projects.subtitle')}
          projects={projects}
          layout="list"
          staggerDelay={150}
          learnMoreLabel={t('projects.learnMore')}
        />
      </div>

      <CTAFinal
        id="cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.button')}
        ctaHref="/contact"
        accentColor="aerospace"
        starfieldWarpSpeed={0.8}
        warpOnHover
        className="-m-4 mt-4">
        <ZoneIntervention
          label={t('zone.title')}
          availability={t('zone.availability')}
          stations={[
            { name: t('zone.locations.annecy'), meta: t(`zone.stations.annecy.meta.${region}`) },
            { name: t('zone.locations.geneva'), meta: t(`zone.stations.geneva.meta.${region}`) },
            { name: t('zone.locations.haute_savoie'), meta: t(`zone.stations.haute_savoie.meta.${region}`) },
            { name: t('zone.locations.suisse_romande'), meta: t(`zone.stations.suisse_romande.meta.${region}`) },
          ]}
        />
      </CTAFinal>
      <AsciiMarquee labels={asciiLabels} />
    </div>
  );
}
