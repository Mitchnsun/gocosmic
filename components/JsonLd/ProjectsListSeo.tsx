import { useLocale, useTranslations } from 'next-intl';
import { JsonLdScript } from 'next-seo';

import { PROJECTS } from '@/data/projects';
import { getCanonicalUrl } from '@/i18n/canonical';

/** The projects page as an ordered list of the case studies, in display order. */
export default function ProjectsListSeo() {
  const locale = useLocale();
  const t = useTranslations('projectsList');

  return (
    <JsonLdScript
      scriptKey="projects-list-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: PROJECTS.map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: t(`items.${project.i18nKey}.title`),
          url: getCanonicalUrl(locale, project.href),
        })),
      }}
    />
  );
}
