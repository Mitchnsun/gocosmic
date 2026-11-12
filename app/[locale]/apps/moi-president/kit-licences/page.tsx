import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { LegalDocument, type LegalSection } from '@/components/LegalDocument';
import { assertRouteLocale, buildPageMetadata } from '@/lib/seo';

const ROUTE = '/apps/moi-president/kit-licences';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  const t = await getTranslations({ locale, namespace: 'moiPresidentLegal' });

  return buildPageMetadata({
    locale,
    routeKey: ROUTE,
    title: t('kitLicences.meta.title'),
    description: t('kitLicences.meta.description'),
    // Legal pages stay reachable but out of search results and the sitemap.
    robots: { index: false, follow: true },
  });
}

/**
 * The licences of Moi Président's campaign kit, in French and English: the `LICENSE` of the kit repository word for
 * word, « ce dépôt » named (owner, 12/11/2026). The manifests of the kit's editions link to it. Its sections are
 * read raw: their « <mois> <année> » is text, not a rich-text tag.
 */
export default async function MoiPresidentKitLicencesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  assertRouteLocale(locale, ROUTE);
  setRequestLocale(locale);
  const t = await getTranslations('moiPresidentLegal');

  return (
    <LegalDocument
      eyebrow={t('eyebrow')}
      title={t('kitLicences.title')}
      updated={t('kitLicences.updated')}
      intro={t.raw('kitLicences.intro') as string}
      sections={t.raw('kitLicences.sections') as LegalSection[]}
    />
  );
}
