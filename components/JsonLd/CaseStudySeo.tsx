import { useLocale, useTranslations } from 'next-intl';
import { JsonLdScript } from 'next-seo';

import { type CaseStudySlug, PROJECTS_BY_SLUG } from '@/components/CaseStudy';
import { getCanonicalUrl, SITE_URL } from '@/i18n/canonical';

type CaseStudySeoProps = {
  slug: CaseStudySlug;
};

/** A case study as a creative work by the studio, with its breadcrumb trail (Home › Projects › case). */
export default function CaseStudySeo({ slug }: CaseStudySeoProps) {
  const locale = useLocale();
  const t = useTranslations('projectsList');
  const tNav = useTranslations('navigation');
  // eslint-disable-next-line security/detect-object-injection
  const project = PROJECTS_BY_SLUG[slug];
  const url = getCanonicalUrl(locale, project.href);
  const name = t(`items.${project.i18nKey}.title`);

  const trail = [
    { name: tNav('home_menu'), item: getCanonicalUrl(locale, '/') },
    { name: tNav('projects'), item: getCanonicalUrl(locale, '/projects') },
    { name, item: url },
  ];

  return (
    <JsonLdScript
      scriptKey={`case-study-json-ld-${slug}`}
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CreativeWork',
            '@id': `${url}#work`,
            name,
            description: t(`items.${project.i18nKey}.description`),
            genre: t(`kinds.${project.kind}`),
            dateCreated: String(project.year),
            ...('latestRelease' in project && {
              version: project.latestRelease.version,
              dateModified: project.latestRelease.date,
            }),
            url,
            inLanguage: locale,
            creator: { '@id': `${SITE_URL}/#company` },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: trail.map((step, index) => ({ '@type': 'ListItem', position: index + 1, ...step })),
          },
        ],
      }}
    />
  );
}
