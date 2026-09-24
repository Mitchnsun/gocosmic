import type { ReactNode } from 'react';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

export interface WhyStudioReason {
  title: string;
  description: string;
}

interface WhyStudioProps {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  reasons: WhyStudioReason[];
  id?: string;
}

/** Why a studio rather than a site builder: the argument on the left, numbered reasons on the right. */
export function WhyStudio({ eyebrow, title, lead, reasons, id = 'why-studio' }: WhyStudioProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('bg-space', SECTION_Y)}>
      <div className={cn(CONTAINER, 'grid items-start gap-[clamp(2rem,5vw,5rem)] lg:grid-cols-2')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        <ol className="bg-ghost/10 border-ghost/10 grid gap-px overflow-hidden rounded-2xl border">
          {reasons.map((reason, index) => (
            <li key={reason.title} className="bg-space">
              <Reveal delay={index * 50} className="grid grid-cols-[auto_1fr] items-baseline gap-4 px-6 py-5">
                <span className="text-jungle text-2xs font-mono" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="font-display font-semibold">{reason.title}</h3>
                  <p className="text-ghost/65 mt-1 leading-normal">{reason.description}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
