import Image from 'next/image';
import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

interface StudioIntroProps {
  eyebrow: string;
  title: ReactNode;
  paragraphs: string[];
  /** Mono line of the areas served, e.g. `Chêne-Bougeries · base`. */
  zones: string[];
  /** Portrait of the founder; the section falls back to a single column without it. */
  portrait?: { src: string; alt: string; width: number; height: number };
  /** Extra content after the zone line, e.g. a LinkedIn link. */
  children?: ReactNode;
  id?: string;
}

/** Who is behind the studio: a person, not a platform. */
export function StudioIntro({
  eyebrow,
  title,
  paragraphs,
  zones,
  portrait,
  children,
  id = 'studio',
}: StudioIntroProps) {
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={SECTION_Y}>
      <div
        className={cn(CONTAINER, 'grid items-center gap-[clamp(2rem,5vw,5rem)]', {
          'lg:grid-cols-[minmax(0,420px)_1fr]': portrait,
        })}>
        {portrait && (
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            className="border-ghost/10 aspect-[4/5] w-full max-w-[420px] rounded-3xl border object-cover"
          />
        )}
        <div className="flex max-w-3xl flex-col gap-5">
          <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-ghost/70 leading-relaxed">
              {paragraph}
            </p>
          ))}
          <ul className="text-ghost/45 text-2xs flex flex-wrap gap-x-8 gap-y-3 pt-2 font-mono tracking-[0.16em] uppercase">
            {zones.map((zone) => (
              <li key={zone}>{zone}</li>
            ))}
          </ul>
          {children}
        </div>
      </div>
    </section>
  );
}
