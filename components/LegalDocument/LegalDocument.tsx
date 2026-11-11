import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, PAGE_TOP, SECTION_Y } from '@/design-system/pill';

import type { LegalSection } from './LegalDocument.types';
import { LegalSectionCard } from './LegalSectionCard';

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  /** "Last updated" line under the title. */
  updated: string;
  intro: string;
  sections: readonly LegalSection[];
  /** Block between the intro and the sections, e.g. a correction to publish at the top of the page. */
  banner?: ReactNode;
  /** Closing note after the sections, e.g. a pointer to another legal page. */
  children?: ReactNode;
}

/**
 * Layout shared by the legal notices, privacy policies and terms of sale of the site and of the studio's apps:
 * readable column, one card per section.
 */
export function LegalDocument({ eyebrow, title, updated, intro, sections, banner, children }: LegalDocumentProps) {
  return (
    <div className={cn('bg-bg text-fg', SECTION_Y, PAGE_TOP)}>
      <div className={cn(CONTAINER, 'flex max-w-4xl flex-col gap-10')}>
        <div className="flex flex-col gap-4">
          <SectionHeading
            level={1}
            eyebrow={eyebrow}
            title={title}
            titleId="legal-title"
            titleClassName="text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.02]"
          />
          <p className="text-fg-3 text-2xs font-mono tracking-[0.16em] uppercase">{updated}</p>
          <p className="text-fg-2 max-w-[64ch] text-lg leading-relaxed text-pretty">{intro}</p>
        </div>

        {banner}

        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <LegalSectionCard key={section.id ?? section.title} section={section} />
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
