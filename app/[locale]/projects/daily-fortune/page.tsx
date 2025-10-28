import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  CodeBracketIcon,
  CpuChipIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dailyFortune' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function DailyFortune() {
  const t = useTranslations('dailyFortune');

  return (
    <div className="text-ghost relativept-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <Image
            src="/projects/daily-fortune/app-icon.png"
            className="overflow-hidden rounded-2xl"
            alt="Daily Fortune Logo"
            width={100}
            height={100}
          />
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
            <p className="text-lg text-gray-400">{t('subtitle')}</p>
          </div>
        </div>

        {/* Overview Section */}
        <section className="w-full" aria-labelledby="overview-heading">
          <div className="relative rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CalendarDaysIcon className="h-8 w-8 shrink-0 text-purple-400" aria-hidden="true" />
              <h2 id="overview-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('overview.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">{t('overview.description')}</p>
              <p>{t('overview.motivation')}</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full" aria-labelledby="features-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <SparklesIcon className="h-8 w-8 shrink-0 text-yellow-400" aria-hidden="true" />
              <h2 id="features-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('features.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <ul className="grid gap-3 md:grid-cols-2">
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400" aria-hidden="true"></span>
                  <span>{t('features.items.daily')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" aria-hidden="true"></span>
                  <span>{t('features.items.motivation')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-600" aria-hidden="true"></span>
                  <span>{t('features.items.modern')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-700" aria-hidden="true"></span>
                  <span>{t('features.items.cosmic')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="w-full" aria-labelledby="technology-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CodeBracketIcon className="h-8 w-8 shrink-0 text-blue-400" aria-hidden="true" />
              <h2 id="technology-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('technology.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">{t('technology.description')}</p>
              <ul className="grid gap-3 md:grid-cols-2">
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" aria-hidden="true"></span>
                  <span>{t('technology.stack.nextjs')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true"></span>
                  <span>{t('technology.stack.typescript')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
                  <span>{t('technology.stack.tailwind')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" aria-hidden="true"></span>
                  <span>{t('technology.stack.native')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* AI Integration Section */}
        <section className="w-full" aria-labelledby="ai-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CpuChipIcon className="h-8 w-8 shrink-0 text-green-400" aria-hidden="true" />
              <h2 id="ai-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('ai.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">{t('ai.description')}</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="flex w-full flex-col items-center justify-center gap-8 lg:flex-row"
          aria-labelledby="cta-heading">
          <Image
            src="/projects/daily-fortune/splashscreen.png"
            className="overflow-hidden rounded-lg"
            alt="Daily Fortune Illustration"
            width={250}
            height={250}
          />
          <div className="flex max-w-5xl flex-col items-center gap-6 rounded-lg bg-gray-800 px-6 py-12 lg:p-12">
            <h2 id="cta-heading" className="text-center text-3xl font-bold lg:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="text-center text-lg text-gray-400">{t('cta.description')}</p>
            <a
              href="https://github.com/Mitchnsun/daily-fortune"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-royal hover:bg-royal/90 inline-flex items-center gap-2 rounded-full px-6 py-2 text-base font-normal text-neutral-50 transition-colors"
              aria-label="Visit Daily Fortune repository (opens in a new tab)">
              {t('cta.button')}
              <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
