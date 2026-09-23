import { CodeBracketIcon, PuzzlePieceIcon, RocketLaunchIcon, SparklesIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { ContentSection } from '@/components/ContentSection';
import CTAFinal from '@/components/CTAFinal';
import PageHero from '@/components/PageHero';
import { SERVICE_DETAIL_DEFINITIONS, ServiceDetail } from '@/components/ServiceDetail';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { getCanonicalUrl } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'services' });

  const title = t('meta.title');
  const description = t('meta.description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/services'),
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

/** Icons per service anchor — kept out of the shared definitions so the
 *  constants file stays free of JSX. */
const SERVICE_ICONS: Record<string, ReactNode> = {
  development: <CodeBracketIcon className="size-5" aria-hidden="true" />,
  design: <SparklesIcon className="size-5" aria-hidden="true" />,
  ai: <PuzzlePieceIcon className="size-5" aria-hidden="true" />,
  launch: <RocketLaunchIcon className="size-5" aria-hidden="true" />,
};

export default async function Services() {
  const t = await getTranslations('services');
  const total = SERVICE_DETAIL_DEFINITIONS.length;

  return (
    <div className="bg-void text-ghost relative">
      <PageHero
        id="services-hero"
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('subtitle')}
        cta={{ text: t('hero.cta'), href: '/contact' }}
        secondaryCta={{ text: t('hero.secondary'), href: '/pricing' }}
      />

      <div className="m-auto flex max-w-7xl flex-col gap-10 p-4 sm:p-6 lg:p-8">
        {SERVICE_DETAIL_DEFINITIONS.map((definition, position) => (
          <ServiceDetail
            key={definition.anchor}
            id={definition.anchor}
            accent={definition.accent}
            icon={SERVICE_ICONS[definition.anchor]}
            index={`${String(position + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
            title={t(`${definition.key}.title`)}
            subtitle={t(`${definition.key}.subtitle`)}
            description={t(`${definition.key}.description`)}
            groups={definition.groups.map((group) => ({
              label: t(`${definition.key}.${group.key}.title`),
              items: group.items.map((item) => t(`${definition.key}.${group.key}.items.${item}`)),
            }))}
          />
        ))}

        {/* Projects & pricing entry points */}
        <ContentSection
          id="explore"
          eyebrow={t('explore.eyebrow')}
          title={t('explore.title')}
          lead={t('explore.description')}>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className={cn(
                buttonVariants({ variant: 'aerospace' }),
                'w-fit py-3 transition-transform hover:scale-105 motion-reduce:scale-100! motion-reduce:transition-none!'
              )}>
              {t('explore.projects')}
            </Link>
            <Link
              href="/pricing"
              className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost font-display w-fit rounded-full border px-6 py-3 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none">
              {t('explore.pricing')}
            </Link>
            <Link
              href="/local"
              className="border-ghost/15 text-ghost hover:border-ghost hover:bg-ghost/5 focus-visible:ring-ghost font-display w-fit rounded-full border px-6 py-3 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none">
              {t('cta.local_page')}
            </Link>
          </div>
          <p className="text-ghost/35 text-3xs mt-8 font-mono tracking-[0.2em] uppercase">
            {t('cta.geo_availability')}
          </p>
        </ContentSection>
      </div>

      <CTAFinal
        id="services-cta"
        headline={t('cta.title')}
        description={t('cta.description')}
        ctaText={t('cta.primary_button')}
        ctaHref="/journey"
        accentColor="aerospace"
        tone="sober"
      />
    </div>
  );
}
