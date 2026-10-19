import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useTranslations } from 'next-intl';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

import type { RelatedPage } from './ContentPage.types';

const HEADING_ID = 'related-pages-heading';
/** Where each related page leads; its label and description live in `contentPages.links`. */
const HREFS = { pricing: '/pricing', projects: '/projects', services: '/services' } as const;

/** Two linked cards closing a content page, each with a sentence on what the visitor finds there. */
export function RelatedPages({ pages }: { pages: readonly RelatedPage[] }) {
  const t = useTranslations('contentPages');

  return (
    <section aria-labelledby={HEADING_ID} className={cn('border-line border-t', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={t('related.eyebrow')} title={t('related.title')} titleId={HEADING_ID} />
        <ul className="grid gap-4 md:grid-cols-2">
          {pages.map((key) => (
            <li key={key} className="flex">
              <Link
                href={HREFS[key]}
                className="border-line bg-surface hover:bg-line hover:border-line-2 focus-visible:ring-fg flex w-full flex-col gap-2 rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none">
                <span className="font-display text-fg flex items-center gap-2 text-xl font-medium">
                  {t(`links.${key}.label`)}
                  <ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" />
                </span>
                <span className="text-fg-2 leading-relaxed">{t(`links.${key}.description`)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
