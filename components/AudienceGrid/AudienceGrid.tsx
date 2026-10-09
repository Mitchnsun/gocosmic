import type { ReactNode } from 'react';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { HairlineGrid } from '@/design-system/hairline-grid';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

interface AudienceItem {
  title: string;
  description: string;
}

interface AudienceGridProps {
  eyebrow: string;
  title: ReactNode;
  items: AudienceItem[];
  id?: string;
}

/** Numbered cards separated by hairlines: who the studio is for, or where it works. */
export function AudienceGrid({ eyebrow, title, items, id = 'audience' }: AudienceGridProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('border-line border-t', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <HairlineGrid
          className={cn({ 'md:grid-cols-3': items.length % 3 === 0, 'md:grid-cols-2': items.length % 3 !== 0 })}>
          {items.map((item, index) => (
            <li key={item.title} className="bg-bg">
              <Reveal delay={index * 50} className="flex h-full flex-col gap-3 p-8">
                <span className="text-fg-3 text-2xs font-mono" aria-hidden="true">
                  /{String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em]">{item.title}</h3>
                <p className="text-fg-2 leading-relaxed">{item.description}</p>
              </Reveal>
            </li>
          ))}
        </HairlineGrid>
      </div>
    </section>
  );
}
