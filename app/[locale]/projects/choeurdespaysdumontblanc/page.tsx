import {
  ArrowTopRightOnSquareIcon,
  CalendarDaysIcon,
  CodeBracketIcon,
  MusicalNoteIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/design-system/button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'choeurDesPaysduMontBlanc' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function ChoeurDesPaysduMontBlanc() {
  const t = useTranslations('choeurDesPaysduMontBlanc');

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <Image
            src="/projects/choeurdespaysdumontblanc/CPMB-logo-blanc.png"
            alt="Choeur des Pays du Mont Blanc Logo"
            width={160}
            height={55}
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
              <p>{t('overview.mission')}</p>
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
                  <span>{t('features.items.concerts')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" aria-hidden="true"></span>
                  <span>{t('features.items.repertoire')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-600" aria-hidden="true"></span>
                  <span>{t('features.items.community')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-700" aria-hidden="true"></span>
                  <span>{t('features.items.events')}</span>
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
                  <span>{t('technology.stack.responsive')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="w-full" aria-labelledby="purpose-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <MusicalNoteIcon className="h-8 w-8 shrink-0 text-green-400" aria-hidden="true" />
              <h2 id="purpose-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('purpose.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">{t('purpose.description')}</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="flex max-w-5xl flex-col items-center gap-6 rounded-lg bg-gray-800 px-6 py-12 lg:p-12"
          aria-labelledby="cta-heading">
          <h2 id="cta-heading" className="text-center text-3xl font-bold lg:text-4xl">
            {t('cta.title')}
          </h2>
          <p className="text-center text-lg text-gray-400">{t('cta.description')}</p>
          <a
            href="https://choeurdespaysdumontblanc.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('cta.ariaLabel')}>
            <Button variant="royal" className="gap-2">
              {t('cta.button')}
              <ArrowTopRightOnSquareIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
          </a>
        </section>
      </main>
    </div>
  );
}
