import { useTranslations } from 'next-intl';

import CTAFinal from '@/components/CTAFinal';
import HeroSection from '@/components/HeroSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { homepageSteps } from '@/components/ProcessTimeline/constants';
import { ServicesGrid } from '@/components/ServicesGrid';

export default function Home() {
  const t = useTranslations('homepage');

  const processSteps = homepageSteps.map((step) => ({
    ...step,
    label: t(`process.${step.id}.label`),
    title: t(`process.${step.id}.title`),
    description: t(`process.${step.id}.description`),
  }));

  return (
    <div className="text-ghost bg-void relative p-4">
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
        <ServicesGrid />
      </section>
      <section className="relative z-10 m-auto max-w-7xl px-4 py-8 text-center">
        <h3 className="text-2xl font-bold">{t('zone.title')}</h3>
        <p className="mt-2 text-gray-400">{t('zone.description')}</p>
        <ul className="mt-4 flex justify-center gap-6 text-blue-300">
          <li>📍 {t('zone.locations.annecy')}</li>
          <li>📍 {t('zone.locations.geneva')}</li>
          <li>📍 {t('zone.locations.haute_savoie')}</li>
        </ul>
      </section>
      <CTAFinal
        id="cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.button')}
        ctaHref="/contact"
        accentColor="aerospace"
        starfieldWarpSpeed={0.8}
        warpOnHover
        className="-m-4 mt-4"
      />
    </div>
  );
}
