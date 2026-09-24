import type { ReactNode } from 'react';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

export interface ServiceItem {
  title: string;
  description: string;
  tags: string[];
}

interface ServicesGridProps {
  eyebrow: string;
  title: ReactNode;
  services: ServiceItem[];
  id?: string;
}

/** What the studio does: numbered cards separated by hairlines, each with mono tags. */
export function ServicesGrid({ eyebrow, title, services, id = 'trades' }: ServicesGridProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={SECTION_Y}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <ul className="bg-ghost/8 border-ghost/8 grid gap-px overflow-hidden rounded-[20px] border sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <li key={service.title} className="bg-void">
              <Reveal delay={index * 50} className="flex h-full flex-col gap-3 p-7">
                <span className="text-ghost/35 text-2xs font-mono" aria-hidden="true">
                  /{String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{service.title}</h3>
                <p className="text-ghost/60 text-[15px] leading-relaxed">{service.description}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-ghost/15 text-ghost/60 text-3xs rounded-full border px-2.5 py-1 font-mono tracking-[0.12em] uppercase">
                      {tag}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
