import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { BRAND_NAME } from '@/lib/config';
import { buildPageMetadata } from '@/lib/seo';

import { type CaseStudySlug, PROJECTS_BY_SLUG } from './constants';

/**
 * Metadata of a case study page, built from its project card: "<name> · <kind> | Cosmic Studio"
 * as the title and the card's description. Server only, so it stays out of the `index.ts` surface.
 */
export async function buildCaseStudyMetadata(locale: string, slug: CaseStudySlug): Promise<Metadata> {
  const project = PROJECTS_BY_SLUG[slug];
  const t = await getTranslations({ locale, namespace: 'projectsList' });

  return buildPageMetadata({
    locale,
    routeKey: project.href,
    title: `${t(`items.${project.i18nKey}.title`)} · ${t(`kinds.${project.kind}`)} | ${BRAND_NAME}`,
    description: t(`items.${project.i18nKey}.description`),
    type: 'article',
  });
}
