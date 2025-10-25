import {
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  SparklesIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { Button } from '@/design-system/button';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'offers' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default function Offers() {
  const t = useTranslations('offers');

  return (
    <div className="text-ghost relative bg-gray-900 pt-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Solo Developer Offer */}
        <section className="w-full" aria-labelledby="solo-developer-heading">
          <div className="relative rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CodeBracketIcon className="h-8 w-8 shrink-0 text-blue-400" aria-hidden="true" />
              <h2 id="solo-developer-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('solo_developer.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-blue-300 sm:text-xl">{t('solo_developer.subtitle')}</h3>
                <p className="text-lg">{t('solo_developer.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('solo_developer.features.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.dedication')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.technologies')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.deployment')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.responsive')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.testing')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.support')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.communication')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-blue-400" aria-hidden="true" />
                    <span>{t('solo_developer.features.items.optimization')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('solo_developer.ideal_for.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" aria-hidden="true"></span>
                    <span>{t('solo_developer.ideal_for.items.startups')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true"></span>
                    <span>{t('solo_developer.ideal_for.items.mvp')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
                    <span>{t('solo_developer.ideal_for.items.apps')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" aria-hidden="true"></span>
                    <span>{t('solo_developer.ideal_for.items.redesign')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Team Developers Offer */}
        <section className="w-full" aria-labelledby="team-developers-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <UserGroupIcon className="h-8 w-8 shrink-0 text-green-400" aria-hidden="true" />
              <h2 id="team-developers-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('team_developers.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-green-300 sm:text-xl">
                  {t('team_developers.subtitle')}
                </h3>
                <p className="text-lg">{t('team_developers.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('team_developers.features.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.team')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.fullstack')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.architecture')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.databases')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.apis')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.infrastructure')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.security')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.cicd')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.monitoring')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-400" aria-hidden="true" />
                    <span>{t('team_developers.features.items.documentation')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('team_developers.ideal_for.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" aria-hidden="true"></span>
                    <span>{t('team_developers.ideal_for.items.enterprise')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" aria-hidden="true"></span>
                    <span>{t('team_developers.ideal_for.items.platforms')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-600" aria-hidden="true"></span>
                    <span>{t('team_developers.ideal_for.items.complex')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-700" aria-hidden="true"></span>
                    <span>{t('team_developers.ideal_for.items.scaling')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Developer + Designer Offer */}
        <section className="w-full" aria-labelledby="developer-designer-heading">
          <div className="rounded-lg bg-gray-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <SparklesIcon className="h-8 w-8 shrink-0 text-purple-400" aria-hidden="true" />
              <h2 id="developer-designer-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('developer_designer.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-purple-300 sm:text-xl">
                  {t('developer_designer.subtitle')}
                </h3>
                <p className="text-lg">{t('developer_designer.description')}</p>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('developer_designer.features.title')}:</h4>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.collaboration')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.ux_research')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.design_system')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.prototyping')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.development')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.animations')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.accessibility')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.testing')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.assets')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircleIcon className="h-5 w-5 shrink-0 text-purple-400" aria-hidden="true" />
                    <span>{t('developer_designer.features.items.iterations')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold text-white">{t('developer_designer.ideal_for.title')}:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-400" aria-hidden="true"></span>
                    <span>{t('developer_designer.ideal_for.items.brands')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500" aria-hidden="true"></span>
                    <span>{t('developer_designer.ideal_for.items.consumer')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-600" aria-hidden="true"></span>
                    <span>{t('developer_designer.ideal_for.items.ecommerce')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-purple-700" aria-hidden="true"></span>
                    <span>{t('developer_designer.ideal_for.items.saas')}</span>
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
              <Button variant="royal" className="flex items-center gap-2" asChild>
                <a href="https://mcomper.at/" rel="noopener noreferrer" target="_blank">
                  <RocketLaunchIcon className="h-5 w-5" aria-hidden="true" />
                  {t('cta.primary_button')}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="jungle" className="flex items-center gap-2" asChild>
                <a href="https://mcomper.at/" rel="noopener noreferrer" target="_blank">
                  {t('cta.secondary_button')}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" aria-hidden="true" />
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
