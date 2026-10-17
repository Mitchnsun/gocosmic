import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useLocale, useTranslations } from 'next-intl';

import { CONTENT_PAGE_LABELS, SEE_ALSO } from '@/data/content-pages';
import { Link } from '@/i18n/navigation';
import { hasRoute } from '@/i18n/route-locales';

import type { CaseStudySlug } from './constants';

const HEADING_ID = 'case-study-see-also';

/**
 * "See also" links from a case study to the pages it illustrates, e.g. the choir mockup to the showcase website
 * page. A page missing from the current language is left out, and so is the block when none is left.
 *
 * @component
 */
export const CaseStudySeeAlso = ({ slug }: { slug: CaseStudySlug }) => {
  const locale = useLocale();
  const t = useTranslations('contentPages');
  const routes = (SEE_ALSO[slug] ?? []).filter((route) => hasRoute(locale, route));

  if (routes.length === 0) return null;

  return (
    <section aria-labelledby={HEADING_ID} className="flex flex-col gap-4">
      <h2 id={HEADING_ID} className="text-fg-3 text-2xs font-mono font-normal tracking-[0.24em] uppercase">
        {t('see_also')}
      </h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {routes.map((route) => (
          <li key={route} className="flex">
            <Link
              href={route}
              className="border-line bg-surface hover:bg-line hover:border-line-2 focus-visible:ring-fg font-display text-fg flex w-full items-center gap-2 rounded-2xl border p-6 text-xl font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none">
              {t(`links.${CONTENT_PAGE_LABELS[route]}.label`)}
              <ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};
