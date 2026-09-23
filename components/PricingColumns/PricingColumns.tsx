import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

import { PricingColumn } from './PricingColumn';
import type { PricingColumnContent } from './PricingColumns.types';

interface PricingColumnsProps {
  eyebrow: string;
  title: ReactNode;
  columns: PricingColumnContent[];
  id?: string;
  className?: string;
}

/** The ways to work together: subscription highlighted, then guidance, reinforcement and a custom quote. */
export function PricingColumns({ eyebrow, title, columns, id = 'pricing', className }: PricingColumnsProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn(SECTION_Y, className)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <div className="grid gap-5 md:grid-cols-2">
          {columns.map((column, index) => (
            <PricingColumn key={column.title} column={column} highlighted={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
