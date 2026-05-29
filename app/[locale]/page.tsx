import { useTranslations } from 'next-intl';

import HeroSection from '@/components/HeroSection';
import { ProcessTimeline } from '@/components/ProcessTimeline';
import { homepageSteps } from '@/components/ProcessTimeline/constants';
import { ServicesGrid } from '@/components/ServicesGrid';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

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
        <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-slate-800 px-4 py-12">
          <h3 className="py-2 text-center text-xl font-bold sm:text-3xl">{t('cta.title')}</h3>
          <p className="text-center font-light text-gray-400">{t('cta.description')}</p>
          <Link
            href="/offers"
            className={cn(buttonVariants({ variant: 'jungle' }), 'mt-2 w-fit gap-2')}
            aria-label={t('cta.viewOffers')}>
            {t('cta.viewOffers')}
          </Link>
        </div>
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
    </div>
  );
}
