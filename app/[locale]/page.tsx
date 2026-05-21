import { CodeBracketIcon, PuzzlePieceIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import HeroSection from '@/components/HeroSection';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

export default function Home() {
  const t = useTranslations('homepage');

  return (
    <div className="text-ghost bg-void relative p-4">
      <HeroSection
        title={t('hero.title')}
        endWord={t('hero.endWord')}
        subtitle={t('hero.subtitle')}
        ctaText={t('hero.cta')}
        ctaHref="/journey"
        accentColor="aerospace"
        starfieldDensity="high"
        parallaxIntensity={0.5}
        className="-m-4 mb-4"
      />
      <section className="relative z-10 m-auto mt-4 flex max-w-7xl flex-col items-center">
        <h3 id="services" className="text-center text-2xl font-bold sm:text-3xl">
          {t('services.title')}
        </h3>
        <div className="grid grid-cols-1 items-stretch justify-center gap-8 py-8 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex flex-col items-center justify-around rounded-lg bg-slate-800 px-2 py-4">
            <CodeBracketIcon className="text-jungle h-6 w-6" aria-hidden="true" />
            <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.development.title')}</h4>
            <p className="text-center font-light text-gray-400">{t('services.development.description')}</p>
          </div>
          <div className="flex flex-col items-center justify-around rounded-lg bg-slate-800 px-2 py-4">
            <SparklesIcon className="text-royal h-6 w-6" aria-hidden="true" />
            <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.design.title')}</h4>
            <p className="text-center font-light text-gray-400">{t('services.design.description')}</p>
          </div>
          <div className="flex flex-col items-center justify-around rounded-lg bg-slate-800 px-2 py-4">
            <PuzzlePieceIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
            <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.ai.title')}</h4>
            <p className="text-center font-light text-gray-400">{t('services.ai.description')}</p>
          </div>
          <div className="flex flex-col items-center justify-around rounded-lg bg-slate-800 px-2 py-4">
            <RocketLaunchIcon className="text-aerospace h-6 w-6" aria-hidden="true" />
            <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.launch.title')}</h4>
            <p className="text-center font-light text-gray-400">{t('services.launch.description')}</p>
          </div>
        </div>

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
