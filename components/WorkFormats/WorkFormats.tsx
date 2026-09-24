import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, ghostPill, SECTION_Y } from '@/design-system/pill';
import { Link } from '@/i18n/navigation';

export interface WorkFormat {
  title: string;
  /** Mono price line, e.g. `600€ HT / jour` or `Sur devis`. */
  price: string;
  description: string;
}

interface WorkFormatsProps {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  formats: WorkFormat[];
  ctaText: string;
  id?: string;
}

/** Other ways to work with the studio, for companies: day-rate mission, duo, full team. */
export function WorkFormats({ eyebrow, title, lead, formats, ctaText, id = 'formats' }: WorkFormatsProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={cn('border-ghost/8 border-t', SECTION_Y)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} lead={lead} />
        <ul className="grid gap-5 md:grid-cols-3">
          {formats.map((format) => (
            <li
              key={format.title}
              className="border-ghost/8 bg-ghost/[0.02] flex flex-col gap-3 rounded-[20px] border p-7">
              <p className="text-ghost/45 text-3xs font-mono tracking-[0.18em] uppercase">{format.price}</p>
              <h3 className="font-display text-xl font-semibold tracking-[-0.02em]">{format.title}</h3>
              <p className="text-ghost/60 text-[15px] leading-relaxed">{format.description}</p>
            </li>
          ))}
        </ul>
        <Link href="/contact" className={ghostPill('w-fit')}>
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
