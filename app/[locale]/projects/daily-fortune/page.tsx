import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { buildCaseStudyNavigation, CaseStudy } from '@/components/CaseStudy';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dailyFortune' });

  const title = t('title');
  const description = t('subtitle');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects/daily-fortune'),
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

export default function DailyFortune() {
  const t = useTranslations('dailyFortune');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <CaseStudy
      eyebrow={tCommon('eyebrow')}
      title={t('title')}
      tagline={t('subtitle')}
      accent="royal"
      logo={{ src: '/projects/daily-fortune/app-icon.png', alt: t('title') }}
      meta={['2026', tList('items.dailyFortune.client'), tList('kinds.mobile')]}
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
          content: t('result.description'),
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
  );
}
