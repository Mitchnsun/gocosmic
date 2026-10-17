import { ArrowRightIcon } from '@heroicons/react/24/solid';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

import type { RelatedPagesProps } from './ContentPage.types';

const HEADING_ID = 'related-pages-heading';

/** Two or three linked cards closing a content page, each with a sentence on what the visitor finds there. */
export function RelatedPages({ eyebrow, title, pages }: RelatedPagesProps) {
  return (
    <section aria-labelledby={HEADING_ID} className={cn('border-line border-t', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={HEADING_ID} />
        <ul className={cn('grid gap-4', { 'md:grid-cols-2': pages.length === 2, 'md:grid-cols-3': pages.length > 2 })}>
          {pages.map((page) => (
            <li key={page.title} className="flex">
              <Link
                href={page.href}
                className="border-line bg-surface hover:bg-line hover:border-line-2 focus-visible:ring-fg flex w-full flex-col gap-2 rounded-2xl border p-6 transition-colors focus-visible:ring-2 focus-visible:outline-none">
                <span className="font-display text-fg flex items-center gap-2 text-xl font-medium">
                  {page.title}
                  <ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" />
                </span>
                <span className="text-fg-2 leading-relaxed">{page.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
