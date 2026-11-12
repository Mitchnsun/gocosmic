import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { buildCorrection, CorrectionNotice, MoiPresidentHero, MoiPresidentSupport } from '@/components/MoiPresident';
import { MOI_PRESIDENT_CORRECTION, MOI_PRESIDENT_LINKS } from '@/data/moi-president';
import { DEFAULT_LANGUAGE, type Locale, localeWithLanguage } from '@/i18n/locales';
import { hasRoute } from '@/i18n/route-locales';
import { buildPageMetadata } from '@/lib/seo';

const ROUTE = '/apps/moi-president';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'moiPresident' });

  return buildPageMetadata({ locale, routeKey: ROUTE, title: t('meta.title'), description: t('meta.description') });
}

/** Moi Président, the studio's mobile game: what it is, and its support, the App Store's support URL (#176). */
export default async function MoiPresidentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('moiPresident');
  const correction = buildCorrection(t, locale, MOI_PRESIDENT_CORRECTION);
  // The legal pages exist in French and English only: the other languages link to the English version.
  const legalLocale = (route: string): Locale =>
    hasRoute(locale, route) ? (locale as Locale) : localeWithLanguage(locale, DEFAULT_LANGUAGE);

  return (
    <>
      <MoiPresidentHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        lead={t('lead')}
        categories={t.raw('categories') as string[]}
        storesSoon={t('stores_soon')}
        icon={{ src: '/apps/moi-president/app-icon.png', alt: t('icon_alt') }}
        banner={correction && <CorrectionNotice {...correction} />}
      />
      <MoiPresidentSupport
        eyebrow={t('support.eyebrow')}
        title={t('support.title')}
        lead={t('support.lead')}
        email={{ label: t('support.email'), href: MOI_PRESIDENT_LINKS.email }}
        legalLinks={[
          {
            label: t('support.privacy'),
            href: '/apps/moi-president/privacy',
            locale: legalLocale('/apps/moi-president/privacy'),
          },
          {
            label: t('support.legal_notice'),
            href: '/apps/moi-president/legal-notice',
            locale: legalLocale('/apps/moi-president/legal-notice'),
          },
        ]}
        locale={locale}
      />
    </>
  );
}
