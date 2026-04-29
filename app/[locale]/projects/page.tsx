import { MusicalNoteIcon, RocketLaunchIcon, SparklesIcon, TrophyIcon, UserIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { createTranslator, useMessages, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { ComponentType, SVGProps } from 'react';

import projectsData from '@/data/projects.json';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

type RoutingPathname = keyof typeof routing.pathnames;

type IconName = 'SparklesIcon' | 'UserIcon' | 'TrophyIcon' | 'MusicalNoteIcon' | 'RocketLaunchIcon';

const iconMap: Record<IconName, ComponentType<SVGProps<SVGSVGElement>>> = {
  SparklesIcon,
  UserIcon,
  TrophyIcon,
  MusicalNoteIcon,
  RocketLaunchIcon,
};

const iconColorMap: Record<string, string> = {
  'daily-fortune': 'text-yellow-400',
  mcomperat: 'text-blue-400',
  'psc-supersprint': 'text-orange-400',
  choeurdespaysdumontblanc: 'text-purple-400',
};

type ProjectItem = {
  title: string;
  description: string;
};

type ProjectsMessages = {
  projectsList: {
    meta: { title: string; description: string };
    title: string;
    subtitle: string;
    items: Record<string, ProjectItem>;
  };
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });

  return {
    title: t('projectsList.meta.title'),
    description: t('projectsList.meta.description'),
  };
}

export default function Projects() {
  const t = useTranslations('projectsList');
  const messages = useMessages() as unknown as ProjectsMessages;
  const items = messages.projectsList.items;

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Projects Grid */}
        <section className="w-full" aria-label={t('title')}>
          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {projectsData.map((project) => {
              const slug = `/projects/${project.id}`;
              if (!(slug in routing.pathnames)) return null;

              const href = slug as RoutingPathname;
              const Icon = iconMap[project.icon as IconName] ?? RocketLaunchIcon;
              const iconColor = iconColorMap[project.id] ?? 'text-blue-400';
              const item = items[project.i18nKey];

              if (!item) return null;

              return (
                <li key={project.id}>
                  <Link
                    href={href}
                    className="flex h-full flex-col items-center gap-4 rounded-lg bg-slate-800 px-6 py-8 transition-colors hover:bg-slate-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    aria-label={item.title}>
                    <Icon className={`h-10 w-10 shrink-0 ${iconColor}`} aria-hidden="true" />
                    <h2 className="text-center text-xl font-bold">{item.title}</h2>
                    <p className="text-center text-sm text-gray-400">{item.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
