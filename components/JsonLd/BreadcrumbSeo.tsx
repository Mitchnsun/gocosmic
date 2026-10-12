import { useLocale, useTranslations } from 'next-intl';

import { getCanonicalUrl } from '@/i18n/canonical';

import { JsonLd } from './JsonLd';
import { toItemList } from './JsonLd.utils';

/** Footer link label of each page that declares a trail; case studies carry theirs in `CaseStudySeo`. */
const LABELS = {
  '/services': 'link_services',
  '/projects': 'link_projects',
  '/about': 'link_about',
  '/contact': 'link_contact',
  '/local': 'local_page',
  '/free-mockup': 'free_mockup_page',
} as const;

interface BreadcrumbSeoProps {
  route: keyof typeof LABELS;
}

/** The breadcrumb trail of a top-level page (Home › page). */
export default function BreadcrumbSeo({ route }: BreadcrumbSeoProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tNav = useTranslations('navigation');

  const trail = [
    { name: tNav('home_menu'), item: getCanonicalUrl(locale, '/') },
    { name: t(LABELS[route]), item: getCanonicalUrl(locale, route) },
  ];

  return (
    <JsonLd
      scriptKey="breadcrumb-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: toItemList(trail),
      }}
    />
  );
}
