import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import type { Metadata } from 'next';
import { createTranslator } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';

import { CASE_STUDY_HREFS, CASE_STUDY_SLUGS, CASE_STUDY_TITLE_KEYS } from '@/components/CaseStudy';
import CTAFinal from '@/components/CTAFinal';
import PageHero from '@/components/PageHero';
import { accentClasses } from '@/design-system/accent';
import { cn } from '@/design-system/lib/utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages();
  const t = createTranslator({ messages, locale });

  const title = t('projectsList.meta.title');
  const description = t('projectsList.meta.description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects'),
    },
    openGraph: {
      title,
      description,
      images: [og],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitter],
    },
  };
}

/** Accent rotation across the project cards — one accent per card, never mixed. */
const CARD_ACCENTS = ['aerospace', 'royal', 'jungle', 'ghost'] as const;

export default async function Projects() {
  const t = await getTranslations('projectsList');
  const tCase = await getTranslations('case_study');
  const total = String(CASE_STUDY_SLUGS.length).padStart(2, '0');

  return (
    <div className="bg-void text-ghost relative">
      <PageHero id="projects-hero" eyebrow={t('eyebrow')} title={t('title')} lead={t('subtitle')} />

      <div className="m-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <ul className="grid gap-4 sm:grid-cols-2">
          {CASE_STUDY_SLUGS.map((slug, position) => {
            // eslint-disable-next-line security/detect-object-injection
            const titleKey = CASE_STUDY_TITLE_KEYS[slug];
            const accent = CARD_ACCENTS[position % CARD_ACCENTS.length] ?? 'aerospace';
            const { text, bg } = accentClasses(accent);

            return (
              <li key={slug}>
                <Link
                  // eslint-disable-next-line security/detect-object-injection
                  href={CASE_STUDY_HREFS[slug]}
                  className="border-ghost/8 bg-ghost/[0.02] hover:bg-ghost/[0.04] hover:border-ghost/15 focus-visible:ring-ghost group flex h-full flex-col gap-4 rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className={cn('h-1.5 w-1.5 rounded-full', bg)} aria-hidden="true" />
                    <span className="text-ghost/35 text-3xs font-mono tracking-[0.2em]">
                      {String(position + 1).padStart(2, '0')} / {total}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-semibold tracking-[-0.02em]">
                    {t(`items.${titleKey}.title`)}
                  </h2>
                  <p className="text-ghost/55 text-base leading-7">{t(`items.${titleKey}.description`)}</p>
                  <span
                    className={cn(
                      'font-display mt-auto inline-flex items-center gap-1.5 text-sm transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:translate-none! motion-reduce:transition-none!',
                      text
                    )}
                    aria-hidden="true">
                    {tCase('eyebrow')}
                    <ArrowUpRightIcon className="size-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <CTAFinal
        id="projects-cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.button')}
        ctaHref="/contact"
        accentColor="aerospace"
        tone="sober"
      />
    </div>
  );
}
