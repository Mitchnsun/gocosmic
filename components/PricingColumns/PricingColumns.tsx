import { ArrowRightIcon } from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

import { PricingColumn } from './PricingColumn';
import type { PricingColumnContent } from './PricingColumns.types';

interface PricingColumnsProps {
  eyebrow: string;
  title: ReactNode;
  columns: PricingColumnContent[];
  /** Link under the cards, e.g. to the page that shows every column. */
  more?: PricingColumnContent['cta'];
  id?: string;
  className?: string;
}

/** The ways to work together: subscription highlighted, then guidance, reinforcement and a custom quote. */
export function PricingColumns({ eyebrow, title, columns, more, id = 'pricing', className }: PricingColumnsProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('scroll-mt-20', SECTION_Y, className)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <div className="grid gap-5 md:grid-cols-2">
          {columns.map((column, index) => (
            <PricingColumn key={column.title} column={column} highlighted={index === 0} />
          ))}
        </div>
        {more && (
          <Link href={more.href} className={ghostPill('h-11 self-start text-[15px]')}>
            {more.text}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
