import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  ShoppingBagIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid';
import { createTranslator, useTranslations } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { cn } from '@/design-system/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, namespace: 'contact', locale });
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}
type BlockId = 'general' | 'support' | 'technical' | 'commercial';

export default function Contact() {
  const t = useTranslations('contact');

  const blocks: Array<{ id: BlockId; icon: typeof ChatBubbleLeftRightIcon; color: string }> = [
    {
      id: 'general',
      icon: ChatBubbleLeftRightIcon,
      color: 'blue',
    },
    {
      id: 'support',
      icon: WrenchScrewdriverIcon,
      color: 'green',
    },
    {
      id: 'technical',
      icon: EnvelopeIcon,
      color: 'purple',
    },
    {
      id: 'commercial',
      icon: ShoppingBagIcon,
      color: 'yellow',
    },
  ];

  const reasonKeys: Record<BlockId, string[]> = {
    general: ['generalQuestion', 'partnership', 'feedback', 'suggestions', 'mission'],
    support: ['help', 'bugs', 'access', 'technical', 'troubleshooting'],
    technical: ['architecture', 'documentation', 'evolution', 'collaboration', 'api'],
    commercial: ['quote', 'pricing', 'demo', 'meeting', 'purchase'],
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        icon: 'text-blue-400',
        bullet: 'bg-blue-400',
        link: 'text-blue-400 hover:text-blue-300 focus:ring-blue-400',
      },
      green: {
        icon: 'text-green-400',
        bullet: 'bg-green-400',
        link: 'text-green-400 hover:text-green-300 focus:ring-green-400',
      },
      purple: {
        icon: 'text-purple-400',
        bullet: 'bg-purple-400',
        link: 'text-purple-400 hover:text-purple-300 focus:ring-purple-400',
      },
      yellow: {
        icon: 'text-yellow-400',
        bullet: 'bg-yellow-400',
        link: 'text-yellow-400 hover:text-yellow-300 focus:ring-yellow-400',
      },
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="text-ghost relative pt-10">
      <main className="m-auto flex max-w-7xl flex-col items-center gap-10 px-4 pb-4">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-extrabold sm:text-4xl">{t('title')}</h1>
          <p className="text-lg text-gray-400">{t('subtitle')}</p>
        </div>

        {/* Contact Blocks Grid */}
        <div className="grid w-full gap-6 md:grid-cols-2">
          {blocks.map((block) => {
            const Icon = block.icon;
            const colors = getColorClasses(block.color);
            const email = t(`blocks.${block.id}.email`);
            const subject = t(`blocks.${block.id}.subject`);
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

            return (
              <section
                key={block.id}
                className="rounded-lg bg-gray-800 px-6 py-8"
                aria-labelledby={`${block.id}-heading`}>
                {/* Block Header */}
                <div className="mb-6 flex items-center gap-4">
                  <Icon className={cn('h-8 w-8 shrink-0', colors.icon)} aria-hidden="true" />
                  <h2 id={`${block.id}-heading`} className="text-xl font-bold sm:text-2xl">
                    {t(`blocks.${block.id}.title`)}
                  </h2>
                </div>

                {/* Email Display */}
                <div className="mb-6">
                  <p className="text-lg font-medium text-white">{email}</p>
                </div>

                {/* Reasons List */}
                <div className="mb-6">
                  <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">
                    {t(`blocks.${block.id}.reasons.title`)}
                  </h3>
                  <ul className="space-y-3">
                    {reasonKeys[block.id].map((reasonKey) => (
                      <li key={reasonKey} className="flex items-start gap-3">
                        <span
                          className={cn('mt-1.5 h-2 w-2 flex-shrink-0 rounded-full', colors.bullet)}
                          aria-hidden="true"></span>
                        <span className="text-gray-300">{t(`blocks.${block.id}.reasons.items.${reasonKey}`)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Link */}
                <div className="border-t border-gray-700 pt-6">
                  <a
                    href={mailtoLink}
                    className={cn(
                      'inline-flex items-center gap-2 rounded px-4 py-2 font-semibold ring-2 transition-colors focus:outline-none',
                      colors.link
                    )}
                    aria-label={t(`blocks.${block.id}.aria_label`)}>
                    {t(`blocks.${block.id}.cta`)}
                    <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
