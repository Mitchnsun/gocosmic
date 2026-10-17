import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';

import CTAFinal from '@/components/CTAFinal';
import BreadcrumbSeo from '@/components/JsonLd/BreadcrumbSeo';
import { SectionHeading } from '@/components/SectionHeading';
import { type StoryStep, StoryTimeline } from '@/components/StoryTimeline';
import { STORY_MILESTONES } from '@/data/story';
import { buttonVariants } from '@/design-system/button.variants';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';
import { buildPageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'story.meta' });

  return buildPageMetadata({
    locale,
    routeKey: '/story',
    title: t('title'),
    description: t('description'),
  });
}

const em = (chunks: ReactNode) => <em>{chunks}</em>;

export default async function Story({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('story');
  const tAbout = await getTranslations('about');
  const tProjects = await getTranslations('projectsList');

  const steps: StoryStep[] = STORY_MILESTONES.map(({ id, dateTime, current, href }) => ({
    id,
    dateTime,
    current,
    date: t(`steps.${id}.date`),
    title: t(`steps.${id}.title`),
    description: t.has(`steps.${id}.description`) ? t(`steps.${id}.description`) : undefined,
    action: href && (
      <Link href={href} className={cn(buttonVariants({ variant: 'link', size: 'inline' }), 'min-h-11 w-fit')}>
        {tProjects('view_project')}
        <span aria-hidden="true">→</span>
      </Link>
    ),
  }));

  return (
    <>
      <BreadcrumbSeo route="/story" />
      <div className="bg-bg text-fg">
        <section aria-labelledby="story-intro" className={PAGE_TOP}>
          <div className={CONTAINER}>
            <SectionHeading
              level={1}
              eyebrow={t('eyebrow')}
              title={t.rich('title', { em })}
              titleId="story-intro"
              lead={t('lead')}
            />
            <div className={SECTION_Y}>
              <StoryTimeline steps={steps} labelledBy="story-intro" className="max-w-3xl" />
            </div>
          </div>
        </section>

        <CTAFinal
          id="story-cta"
          headline={tAbout('cta.title')}
          description={tAbout('cta.description')}
          ctaText={tAbout('cta.button')}
          ctaHref="/contact"
          tone="sober"
        />
      </div>
    </>
  );
}
