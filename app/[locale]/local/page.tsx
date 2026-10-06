import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import { AudienceGrid } from '@/components/AudienceGrid';
import CTAFinal from '@/components/CTAFinal';
import { buildProjectCards, ProjectGrid } from '@/components/ProjectGrid';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, primaryPill, SECTION_Y } from '@/design-system/pill';
import { getAlternates } from '@/i18n/canonical';
import { Link } from '@/i18n/navigation';
import { getOgImages } from '@/lib/og';
import { getRegion } from '@/lib/region.server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'local' });
  const title = t('meta.title');
  const description = t('meta.description');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: getAlternates(locale, '/local'),
    openGraph: { title, description, images: [og] },
    twitter: { card: 'summary_large_image', title, description, images: [twitter] },
  };
}

const ZONES = ['geneva', 'romandy', 'annecy', 'remote'] as const;
/** Projects featured on this page; the full list lives on /projects. */
const PROJECT_COUNT = 3;

const em = (chunks: ReactNode) => <em>{chunks}</em>;

/** Local landing page for searches around Geneva and Annecy; the lead follows the visitor's region. */
export default async function LocalPage() {
  const t = await getTranslations('local');
  const tProjects = await getTranslations('projectsList');
  const region = await getRegion();
  const projects = buildProjectCards(tProjects).slice(0, PROJECT_COUNT);

  return (
    <div className="bg-bg text-fg">
      <section aria-labelledby="local-intro" className="pt-[clamp(3rem,6.5vw,5.5rem)] pb-[clamp(3rem,6vw,4.5rem)]">
        <div className={cn(CONTAINER, 'flex flex-col gap-8')}>
          <SectionHeading
            level={1}
            eyebrow={t('intro.eyebrow')}
            title={t.rich('intro.title', { em })}
            titleId="local-intro"
            lead={t(`intro.lead.${region}`)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/contact" className={primaryPill()}>
              {t('intro.primary')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/services" className={ghostPill()}>
              {t('intro.secondary')}
            </Link>
          </div>
        </div>
      </section>

      <AudienceGrid
        id="zones"
        eyebrow={t('zones.eyebrow')}
        title={t.rich('zones.title', { em })}
        items={ZONES.map((zone) => ({
          title: t(`zones.items.${zone}.title`),
          description: t(`zones.items.${zone}.description`),
        }))}
      />

      <section aria-labelledby="local-projects" className={cn('border-line border-t', SECTION_Y)}>
        <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow={t('projects.eyebrow')}
              title={t.rich('projects.title', { em })}
              titleId="local-projects"
            />
            <Link href="/projects" className={ghostPill('h-11 text-[15px]')}>
              {t('projects.all')}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <ProjectGrid projects={projects} />
        </div>
      </section>

      <CTAFinal
        id="local-cta"
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
