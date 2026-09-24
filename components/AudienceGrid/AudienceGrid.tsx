import type { ReactNode } from 'react';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

export interface AudienceItem {
  title: string;
  description: string;
}

interface AudienceGridProps {
  eyebrow: string;
  title: ReactNode;
  items: AudienceItem[];
  id?: string;
}

/** "Who it is for": one card per audience, separated by hairlines (gap-px grid). */
export function AudienceGrid({ eyebrow, title, items, id = 'audience' }: AudienceGridProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('border-ghost/8 border-t', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <ul className="bg-ghost/8 border-ghost/8 grid gap-px overflow-hidden rounded-[20px] border md:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.title} className="bg-void">
              <Reveal delay={index * 50} className="flex h-full flex-col gap-3 p-8">
                <span className="text-ghost/35 text-2xs font-mono" aria-hidden="true">
                  /{String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="text-ghost/60 leading-relaxed">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
