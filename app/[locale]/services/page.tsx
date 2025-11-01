import {
  CloudIcon,
  CodeBracketIcon,
  CpuChipIcon,
  EnvelopeIcon,
  PuzzlePieceIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/design-system/button';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { Link } from '@/i18n/navigation';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function Services() {
  const t = useTranslations('services');
  const subject = encodeURIComponent(t('cta.email_subject'));

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Stellar Development Section */}
        <section className="w-full" aria-labelledby="stellar-development-heading">
          <div className="relative rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CodeBracketIcon className="h-8 w-8 shrink-0 text-green-400" aria-hidden="true" />
              <h2 id="stellar-development-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('stellar_development.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-green-300 sm:text-xl">
                  {t('stellar_development.subtitle')}
                </h3>
                <p className="text-lg">{t('stellar_development.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">
                  {t('stellar_development.technologies.title')}:
                </h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" aria-hidden="true"></span>
                    <span>{t('stellar_development.technologies.items.frontend')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" aria-hidden="true"></span>
                    <span>{t('stellar_development.technologies.items.architecture')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-600" aria-hidden="true"></span>
                    <span>{t('stellar_development.technologies.items.quality')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-700" aria-hidden="true"></span>
                    <span>{t('stellar_development.technologies.items.performance')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('stellar_development.expertise.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" aria-hidden="true"></span>
                    <span>{t('stellar_development.expertise.items.workflow')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true"></span>
                    <span>{t('stellar_development.expertise.items.scalability')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
                    <span>{t('stellar_development.expertise.items.security')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" aria-hidden="true"></span>
                    <span>{t('stellar_development.expertise.items.apis')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('stellar_development.features.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" aria-hidden="true"></span>
                    <span>{t('stellar_development.features.items.quality')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" aria-hidden="true"></span>
                    <span>{t('stellar_development.features.items.performance')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-600" aria-hidden="true"></span>
                    <span>{t('stellar_development.features.items.maintainability')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-700" aria-hidden="true"></span>
                    <span>{t('stellar_development.features.items.reliability')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Mystical Design Section */}
        <section className="w-full" aria-labelledby="mystical-design-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <SparklesIcon className="h-8 w-8 shrink-0 text-purple-400" aria-hidden="true" />
              <h2 id="mystical-design-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('mystical_design.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-purple-300 sm:text-xl">
                  {t('mystical_design.subtitle')}
                </h3>
                <p className="text-lg">{t('mystical_design.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('mystical_design.approach.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" aria-hidden="true"></span>
                    <span>{t('mystical_design.approach.items.systems')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" aria-hidden="true"></span>
                    <span>{t('mystical_design.approach.items.accessibility')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600" aria-hidden="true"></span>
                    <span>{t('mystical_design.approach.items.responsive')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-700" aria-hidden="true"></span>
                    <span>{t('mystical_design.approach.items.performance')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('mystical_design.tools.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-pink-400" aria-hidden="true"></span>
                    <span>{t('mystical_design.tools.items.components')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-pink-500" aria-hidden="true"></span>
                    <span>{t('mystical_design.tools.items.styling')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-pink-600" aria-hidden="true"></span>
                    <span>{t('mystical_design.tools.items.testing')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-pink-700" aria-hidden="true"></span>
                    <span>{t('mystical_design.tools.items.prototyping')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('mystical_design.outcomes.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" aria-hidden="true"></span>
                    <span>{t('mystical_design.outcomes.items.engagement')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" aria-hidden="true"></span>
                    <span>{t('mystical_design.outcomes.items.conversion')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600" aria-hidden="true"></span>
                    <span>{t('mystical_design.outcomes.items.brand')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-700" aria-hidden="true"></span>
                    <span>{t('mystical_design.outcomes.items.satisfaction')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* AI Powered Section */}
        <section className="w-full" aria-labelledby="ai-powered-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CpuChipIcon className="h-8 w-8 shrink-0 text-yellow-400" aria-hidden="true" />
              <h2 id="ai-powered-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('ai_powered.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-yellow-300 sm:text-xl">{t('ai_powered.subtitle')}</h3>
                <p className="text-lg">{t('ai_powered.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('ai_powered.capabilities.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400" aria-hidden="true"></span>
                    <span>{t('ai_powered.capabilities.items.recommendations')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" aria-hidden="true"></span>
                    <span>{t('ai_powered.capabilities.items.automation')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-600" aria-hidden="true"></span>
                    <span>{t('ai_powered.capabilities.items.analytics')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-700" aria-hidden="true"></span>
                    <span>{t('ai_powered.capabilities.items.nlp')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('ai_powered.implementation.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-400" aria-hidden="true"></span>
                    <span>{t('ai_powered.implementation.items.apis')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-500" aria-hidden="true"></span>
                    <span>{t('ai_powered.implementation.items.privacy')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-600" aria-hidden="true"></span>
                    <span>{t('ai_powered.implementation.items.scalability')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-orange-700" aria-hidden="true"></span>
                    <span>{t('ai_powered.implementation.items.monitoring')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('ai_powered.use_cases.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400" aria-hidden="true"></span>
                    <span>{t('ai_powered.use_cases.items.personalization')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" aria-hidden="true"></span>
                    <span>{t('ai_powered.use_cases.items.support')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-600" aria-hidden="true"></span>
                    <span>{t('ai_powered.use_cases.items.optimization')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-700" aria-hidden="true"></span>
                    <span>{t('ai_powered.use_cases.items.insights')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cosmic Launch Section */}
        <section className="w-full" aria-labelledby="cosmic-launch-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <RocketLaunchIcon className="h-8 w-8 shrink-0 text-blue-400" aria-hidden="true" />
              <h2 id="cosmic-launch-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('cosmic_launch.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-blue-300 sm:text-xl">{t('cosmic_launch.subtitle')}</h3>
                <p className="text-lg">{t('cosmic_launch.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('cosmic_launch.process.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <ShieldCheckIcon className="h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('cosmic_launch.process.items.testing')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <PuzzlePieceIcon className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
                    <span>{t('cosmic_launch.process.items.staging')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <RocketLaunchIcon className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                    <span>{t('cosmic_launch.process.items.deployment')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.process.items.monitoring')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('cosmic_launch.infrastructure.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <CloudIcon className="h-4 w-4 shrink-0 text-sky-400" aria-hidden="true" />
                    <span>{t('cosmic_launch.infrastructure.items.cloud')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-sky-500" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.infrastructure.items.cicd')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <ShieldCheckIcon className="h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
                    <span>{t('cosmic_launch.infrastructure.items.security')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-sky-700" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.infrastructure.items.scaling')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('cosmic_launch.support.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.support.items.monitoring')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.support.items.optimization')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.support.items.updates')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" aria-hidden="true"></span>
                    <span>{t('cosmic_launch.support.items.consultation')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full" aria-labelledby="cta-heading">
          <div className="m-auto flex max-w-5xl flex-col items-center gap-6 rounded-lg bg-gray-800 px-6 py-12 lg:p-12">
            <h2 id="cta-heading" className="text-center text-3xl font-bold lg:text-4xl">
              {t('cta.title')}
            </h2>
            <p className="text-center text-lg text-gray-400 sm:text-xl lg:text-lg">{t('cta.description')}</p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/journey"
                className={cn(buttonVariants({ variant: 'royal' }), 'w-fit gap-2')}
                aria-label={t('cta.primary_button')}>
                <RocketLaunchIcon className="h-5 w-5" aria-hidden="true" />
                {t('cta.primary_button')}
              </Link>
              <Button variant="jungle" className="flex items-center gap-2" asChild>
                <a href={`mailto:prospect@gocosmic.dev?subject=${subject}`} aria-label={t('cta.secondary_button')}>
                  {t('cta.secondary_button')}
                  <EnvelopeIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500">{t('cta.contact_info')}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
