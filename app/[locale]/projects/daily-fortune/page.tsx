import type { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';

import {
  buildCaseStudyMeta,
  buildCaseStudyNavigation,
  CaseStudy,
  formatReleaseDate,
  PROJECTS_BY_SLUG,
} from '@/components/CaseStudy';
import { buildCaseStudyMetadata } from '@/components/CaseStudy/CaseStudy.metadata';
import CaseStudySeo from '@/components/JsonLd/CaseStudySeo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata(locale, 'daily-fortune');
}

export default function DailyFortune() {
  const t = useTranslations('dailyFortune');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');
  const locale = useLocale();
  const { latestRelease } = PROJECTS_BY_SLUG['daily-fortune'];
  const maintained = t('result.maintained', {
    version: latestRelease.version,
    date: formatReleaseDate(latestRelease.date, locale),
  });

  return (
    <>
      <CaseStudy
        eyebrow={tCommon('eyebrow')}
        title={t('title')}
        tagline={t('subtitle')}
        accent={PROJECTS_BY_SLUG['daily-fortune'].accent}
        logo={{ src: PROJECTS_BY_SLUG['daily-fortune'].cover.src, alt: t('title') }}
        meta={buildCaseStudyMeta('daily-fortune', tList)}
        sections={[
          {
            id: 'for-whom',
            label: t('for_whom.label'),
            title: t('for_whom.title'),
            content: t('for_whom.description'),
          },
          {
            id: 'what-we-did',
            label: t('what_we_did.label'),
            title: t('what_we_did.title'),
            content: t('what_we_did.description'),
            columns: 2,
            points: [
              t('what_we_did.items.daily_message'),
              t('what_we_did.items.ai_messages'),
              t('what_we_did.items.clean_design'),
              t('what_we_did.items.stores'),
            ],
          },
          {
            id: 'result',
            label: t('result.label'),
            title: t('result.title'),
            content: `${t('result.description')} ${maintained}`,
          },
        ]}
        cta={{
          title: t('cta.title'),
          description: t('cta.description'),
          button: t('cta.button'),
          href: 'https://apps.apple.com/app/id6754465790',
          ariaLabel: t('cta.ariaLabel'),
        }}
        contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
        navigation={buildCaseStudyNavigation(
          'daily-fortune',
          { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
          (titleKey) => tList(`items.${titleKey}.title`)
        )}
      />
      <CaseStudySeo slug="daily-fortune" />
    </>
  );
}
