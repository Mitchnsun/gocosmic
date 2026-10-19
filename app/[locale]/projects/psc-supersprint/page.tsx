import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';

import {
  buildCaseStudyMeta,
  buildCaseStudyNavigation,
  CaseStudy,
  CaseStudySeeAlso,
  PROJECTS_BY_SLUG,
} from '@/components/CaseStudy';
import { buildCaseStudyMetadata } from '@/components/CaseStudy/CaseStudy.metadata';
import CaseStudySeo from '@/components/JsonLd/CaseStudySeo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata(locale, 'psc-supersprint');
}

export default function PscSupersprint({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('pscSupersprint');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <>
      <CaseStudy
        eyebrow={tCommon('eyebrow')}
        title={t('title')}
        tagline={t('subtitle')}
        accent={PROJECTS_BY_SLUG['psc-supersprint'].accent}
        logo={{
          src: PROJECTS_BY_SLUG['psc-supersprint'].cover.src,
          alt: t('title'),
          // The club logo keeps its red background in both themes.
          background: PROJECTS_BY_SLUG['psc-supersprint'].cover.background,
        }}
        meta={buildCaseStudyMeta('psc-supersprint', tList, locale)}
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
              t('what_we_did.items.live_results'),
              t('what_we_did.items.rankings'),
              t('what_we_did.items.podiums'),
              t('what_we_did.items.athlete_pages'),
              t('what_we_did.items.organiser_space'),
            ],
          },
          {
            id: 'result',
            label: t('result.label'),
            title: t('result.title'),
            content: t('result.description'),
          },
        ]}
        cta={{
          title: t('cta.title'),
          description: t('cta.description'),
          button: t('cta.button'),
          href: 'https://psc-supersprint.vercel.app/',
          ariaLabel: t('cta.ariaLabel'),
        }}
        contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
        navigation={buildCaseStudyNavigation(
          'psc-supersprint',
          { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
          (titleKey) => tList(`items.${titleKey}.title`)
        )}>
        <CaseStudySeeAlso slug="psc-supersprint" />
      </CaseStudy>
      <CaseStudySeo slug="psc-supersprint" />
    </>
  );
}
