import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

import { PricingColumn } from './PricingColumn';
import type { PricingColumnContent } from './PricingColumns.types';

interface PricingColumnsProps {
  eyebrow: string;
  title: ReactNode;
  subscription: PricingColumnContent;
  project: PricingColumnContent;
  id?: string;
  className?: string;
}

/** The two ways to work together: a monthly subscription (highlighted) and a quoted one-off project. */
export function PricingColumns({
  eyebrow,
  title,
  subscription,
  project,
  id = 'pricing',
  className,
}: PricingColumnsProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn(SECTION_Y, className)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <div className="grid gap-5 md:grid-cols-2">
          <PricingColumn column={subscription} highlighted />
          <PricingColumn column={project} />
        </div>
      </div>
    </section>
  );
}
