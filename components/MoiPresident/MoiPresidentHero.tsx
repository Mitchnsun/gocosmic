import Image from 'next/image';
import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { Chip } from '@/design-system/chip';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP, SECTION_Y } from '@/design-system/pill';
import { SignalDot } from '@/design-system/signal-dot';

interface MoiPresidentHeroProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** The game's genres, as the App Store files it. */
  categories: string[];
  /** Where the game will be, until its store pages exist. */
  storesSoon: string;
  icon: { src: string; alt: string };
  /** A correction ordered by the Commission des sondages, above everything else. */
  banner?: ReactNode;
}

/** Intro of the game's page: its icon, what it is, its genres and its stores. */
export function MoiPresidentHero({
  eyebrow,
  title,
  lead,
  categories,
  storesSoon,
  icon,
  banner,
}: MoiPresidentHeroProps) {
  return (
    <section aria-labelledby="moi-president-title" className={cn('bg-bg', SECTION_Y, PAGE_TOP)}>
      <div className={cn(CONTAINER, 'flex flex-col gap-10')}>
        {banner}
        <div className="grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-12">
          <Image
            src={icon.src}
            alt={icon.alt}
            width={128}
            height={128}
            priority
            className="size-24 rounded-[22px] md:size-32 md:rounded-[28px]"
          />
          <div className="flex flex-col gap-6">
            <SectionHeading level={1} eyebrow={eyebrow} title={title} titleId="moi-president-title" lead={lead} />
            <ul className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <li key={category}>
                  <Chip>{category}</Chip>
                </li>
              ))}
            </ul>
            <p className="text-fg-3 text-2xs flex items-center gap-2.5 font-mono tracking-[0.16em] uppercase">
              <SignalDot active={false} />
              {storesSoon}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
