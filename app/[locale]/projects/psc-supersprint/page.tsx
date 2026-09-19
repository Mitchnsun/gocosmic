import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import { buildCaseStudyNavigation, CaseStudy } from '@/components/CaseStudy';
import { getCanonicalUrl } from '@/i18n/canonical';
import { getOgImages } from '@/lib/og';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pscSupersprint' });

  const title = t('title');
  const description = t('subtitle');
  const { og, twitter } = getOgImages(locale);

  return {
    title,
    description,
    alternates: {
      canonical: getCanonicalUrl(locale, '/projects/psc-supersprint'),
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

export default function PscSupersprint() {
  const t = useTranslations('pscSupersprint');
  const tCommon = useTranslations('case_study');
  const tList = useTranslations('projectsList');

  return (
    <CaseStudy
      eyebrow={tCommon('eyebrow')}
      title={t('title')}
      tagline={t('subtitle')}
      accent="jungle"
      meta={['2026', 'Next.js · Firebase', 'Web']}
      sections={[
        {
          id: 'overview',
          title: t('overview.title'),
          content: t('overview.description'),
          secondary: t('overview.mission'),
        },
        {
          id: 'features',
          title: t('features.title'),
          columns: 2,
          points: [
            t('features.items.results'),
            t('features.items.rankings'),
            t('features.items.podiums'),
            t('features.items.athletes'),
            t('features.items.responsive'),
            t('features.items.admin'),
          ],
        },
        {
          id: 'technology',
          title: t('technology.title'),
          content: t('technology.description'),
          columns: 2,
          points: [
            t('technology.stack.nextjs'),
            t('technology.stack.typescript'),
            t('technology.stack.tailwind'),
            t('technology.stack.firebase'),
            t('technology.stack.radix'),
            t('technology.stack.testing'),
          ],
        },
        { id: 'purpose', title: t('purpose.title'), content: t('purpose.description') },
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
      )}
    />
  );
}
