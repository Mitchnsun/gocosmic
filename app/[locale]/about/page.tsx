import { CodeBracketIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/solid';
import { createTranslator, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';

import LinkedInIcon from '@/components/icons/LinkedInIcon';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function About() {
  const t = useTranslations('about');

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Go Cosmic Presentation Section */}
        <section className="w-full" aria-labelledby="go-cosmic-heading">
          <div className="relative rounded-lg bg-slate-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <CodeBracketIcon className="h-8 w-8 shrink-0 text-blue-400" aria-hidden="true" />
              <h2 id="go-cosmic-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('mission.title')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">{t('mission.description')}</p>

              <div className="my-6">
                <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">
                  {t('mission.specialization.title')}:
                </h3>
                <ul className="grid gap-3 md:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" aria-hidden="true"></span>
                    <span>{t('mission.specialization.items.webMobile')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" aria-hidden="true"></span>
                    <span>{t('mission.specialization.items.aiIntegration')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
                    <span>{t('mission.specialization.items.uiUxDesign')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-700" aria-hidden="true"></span>
                    <span>{t('mission.specialization.items.customSolutions')}</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg font-medium text-blue-300">{t('mission.conclusion')}</p>
            </div>
          </div>
        </section>

        {/* Matthieu Compérat Section */}
        <section className="w-full" aria-labelledby="developer-heading">
          <div className="rounded-lg bg-slate-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <UserIcon className="h-8 w-8 shrink-0 text-yellow-400" aria-hidden="true" />
              <h2 id="developer-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('developer.title')} — {t('developer.name')}
              </h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <p className="text-lg">
                <strong className="text-white">
                  {t('developer.name')} — {t('developer.subtitle')}
                </strong>
              </p>

              <p>{t('developer.description')}</p>

              <ul className="grid gap-3 md:grid-cols-2">
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400" aria-hidden="true"></span>
                  <span>{t('developer.expertise.items.modernDev')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" aria-hidden="true"></span>
                  <span>{t('developer.expertise.items.architecture')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-600" aria-hidden="true"></span>
                  <span>{t('developer.expertise.items.aiTech')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-yellow-700" aria-hidden="true"></span>
                  <span>{t('developer.expertise.items.leadership')}</span>
                </li>
              </ul>

              <p>{t('developer.bio')}</p>

              <div className="mt-6 border-t border-gray-700 pt-4">
                <a
                  href="https://www.linkedin.com/in/matthieucomperat/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded px-1 text-blue-400 underline transition-colors hover:text-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  aria-label={t('developer.linkedin_aria')}>
                  {t('developer.linkedin')}
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Mentions Section */}
        <section className="w-full" aria-labelledby="legal-heading">
          <div className="rounded-lg bg-slate-800 px-6 py-8 lg:p-8">
            <div className="mb-6 flex items-center gap-4">
              <ShieldCheckIcon className="h-8 w-8 shrink-0 text-green-400" aria-hidden="true" />
              <h2 id="legal-heading" className="text-xl font-bold sm:text-2xl lg:text-3xl">
                {t('legal.title')}
              </h2>
            </div>
            <div className="space-y-6 text-gray-300">
              <p>{t('legal.intro')}</p>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white sm:text-xl">{t('legal.ai.title')}:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" aria-hidden="true"></span>
                    <span>{t('legal.ai.items.integration')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" aria-hidden="true"></span>
                    <span>{t('legal.ai.items.ethics')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-600" aria-hidden="true"></span>
                    <span>{t('legal.ai.items.compliance')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-700" aria-hidden="true"></span>
                    <span>{t('legal.ai.items.privacy')}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-white sm:text-xl">{t('legal.responsibility.title')}:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-400" aria-hidden="true"></span>
                    <span>{t('legal.responsibility.items.testing')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-500" aria-hidden="true"></span>
                    <span>{t('legal.responsibility.items.recommendations')}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-green-600" aria-hidden="true"></span>
                    <span>{t('legal.responsibility.items.security')}</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 border-t border-gray-700 pt-4">
                <p className="font-medium text-blue-300">
                  {t('legal.contact.text')}
                  <a
                    href={`mailto:support@gocosmic.dev?subject=${encodeURIComponent(t('legal.contact.subject'))}`}
                    className="ml-1 rounded px-1 text-blue-400 underline transition-colors hover:text-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    aria-label={t('legal.contact.ariaLabel')}>
                    {t('legal.contact.link')}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
