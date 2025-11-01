import { CodeBracketIcon, PuzzlePieceIcon, RocketLaunchIcon, SparklesIcon, StarIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

export default function Home() {
  const t = useTranslations('homepage');

  return (
    <div className="text-ghost relative p-4">
      <main className="m-auto flex max-w-7xl flex-col items-center py-16 md:px-4">
        <div className="mb-4 flex flex-col items-center gap-3 md:flex-row">
          <RocketLaunchIcon className="h-10 w-10 text-blue-400" aria-hidden="true" />
          <h2 className="text-center text-2xl font-extrabold sm:text-4xl">{t('hero.title')}</h2>
          <SparklesIcon className="h-8 w-8 text-yellow-400" aria-hidden="true" />
        </div>
        <p className="mb-8 text-center">{t('hero.subtitle')}</p>
        <Link href="/journey" className={cn(buttonVariants({ variant: 'royal' }), 'gap-2')} aria-label={t('hero.cta')}>
          <StarIcon className="h-5 w-5" aria-hidden="true" />
          {t('hero.cta')}
        </Link>
      </main>
      <br />
      <h3 id="services" className="text-center text-2xl font-bold sm:text-3xl">
        {t('services.title')}
      </h3>
      <div className="m-auto grid max-w-7xl grid-cols-1 items-stretch justify-center gap-8 py-8 md:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col items-center justify-around rounded-lg bg-gray-800 px-2 py-4">
          <CodeBracketIcon className="text-jungle h-6 w-6" aria-hidden="true" />
          <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.development.title')}</h4>
          <p className="text-center font-light text-gray-400">{t('services.development.description')}</p>
        </div>
        <div className="flex flex-col items-center justify-around rounded-lg bg-gray-800 px-2 py-4">
          <SparklesIcon className="text-royal h-6 w-6" aria-hidden="true" />
          <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.design.title')}</h4>
          <p className="text-center font-light text-gray-400">{t('services.design.description')}</p>
        </div>
        <div className="flex flex-col items-center justify-around rounded-lg bg-gray-800 px-2 py-4">
          <PuzzlePieceIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
          <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.ai.title')}</h4>
          <p className="text-center font-light text-gray-400">{t('services.ai.description')}</p>
        </div>
        <div className="flex flex-col items-center justify-around rounded-lg bg-gray-800 px-2 py-4">
          <RocketLaunchIcon className="text-aerospace h-6 w-6" aria-hidden="true" />
          <h4 className="my-2 text-center text-xl font-semibold sm:text-2xl">{t('services.launch.title')}</h4>
          <p className="text-center font-light text-gray-400">{t('services.launch.description')}</p>
        </div>
      </div>

      <div className="m-auto flex max-w-7xl flex-col items-center gap-2 rounded-lg bg-gray-800 px-4 py-12">
        <h3 className="py-2 text-center text-xl font-bold sm:text-3xl">{t('cta.title')}</h3>
        <p className="text-center font-light text-gray-400">{t('cta.description')}</p>
        <Link
          href="/offers"
          className={cn(buttonVariants({ variant: 'jungle' }), 'mt-2 w-fit gap-2')}
          aria-label={t('cta.viewOffers')}>
          {t('cta.viewOffers')}
        </Link>
      </div>
    </div>
  );
}
