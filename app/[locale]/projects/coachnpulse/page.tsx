import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

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
  return buildCaseStudyMetadata(locale, 'coachnpulse');
}

export default function CoachNPulse({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('coachNPulse');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');
  const { latestRelease, accent, cover, color } = PROJECTS_BY_SLUG.coachnpulse;
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
        accent={accent}
        logo={{
          src: cover.src,
          alt: t('title'),
          // The logo keeps its black background and its brand-coloured frame in both themes.
          background: cover.background,
          border: color,
        }}
        meta={buildCaseStudyMeta('coachnpulse', tList, locale)}
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
              t('what_we_did.items.programs'),
              t('what_we_did.items.coach'),
              t('what_we_did.items.prices'),
              t('what_we_did.items.contact'),
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
          href: 'https://www.coachnpulse.com/',
          ariaLabel: t('cta.ariaLabel'),
        }}
        contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
        navigation={buildCaseStudyNavigation(
          'coachnpulse',
          { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
          (titleKey) => tList(`items.${titleKey}.title`)
        )}
      />
      <CaseStudySeo slug="coachnpulse" />
    </>
  );
}
