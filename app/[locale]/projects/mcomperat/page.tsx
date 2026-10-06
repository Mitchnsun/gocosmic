import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import { buildCaseStudyMeta, buildCaseStudyNavigation, CaseStudy, PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { buildCaseStudyMetadata } from '@/components/CaseStudy/CaseStudy.metadata';
import CaseStudySeo from '@/components/JsonLd/CaseStudySeo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildCaseStudyMetadata(locale, 'mcomperat');
}

export default function Mcomperat() {
  const t = useTranslations('mcomperat');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <>
      <CaseStudy
        eyebrow={tCommon('eyebrow')}
        title={t('title')}
        tagline={t('subtitle')}
        accent={PROJECTS_BY_SLUG.mcomperat.accent}
        meta={buildCaseStudyMeta('mcomperat', tList)}
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
              t('what_we_did.items.two_languages'),
              t('what_we_did.items.found_on_google'),
              t('what_we_did.items.fast_on_phone'),
              t('what_we_did.items.accessible'),
              t('what_we_did.items.ai_with_review'),
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
          href: 'https://www.mcomper.at/',
          ariaLabel: t('cta.ariaLabel'),
        }}
        contactCta={{ label: tCommon('contact_cta'), href: '/contact' }}
        navigation={buildCaseStudyNavigation(
          'mcomperat',
          { previous: tCommon('previous'), next: tCommon('next'), ariaLabel: tCommon('nav_label') },
          (titleKey) => tList(`items.${titleKey}.title`)
        )}
      />
      <CaseStudySeo slug="mcomperat" />
    </>
  );
}
