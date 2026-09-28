import type { ReactNode } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER } from '@/design-system/pill';
import { renderWithLinks } from '@/lib/renderWithLinks';

export interface LegalSection {
  title: string;
  body: string[];
}

interface LegalDocumentProps {
  eyebrow: string;
  title: string;
  /** "Last updated" line under the title. */
  updated: string;
  intro: string;
  sections: LegalSection[];
  /** Closing note after the sections, e.g. a pointer to another legal page. */
  children?: ReactNode;
}

/** Layout shared by the legal notice, privacy policy and terms of sale: readable column, one card per section. */
export function LegalDocument({ eyebrow, title, updated, intro, sections, children }: LegalDocumentProps) {
  return (
    <div className="bg-bg text-fg pt-[clamp(3.5rem,8vw,7rem)] pb-[clamp(4rem,8vw,7.5rem)]">
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

        <div className="flex flex-col gap-4">
          {sections.map((section) => (
            <section key={section.title} className="border-line bg-surface rounded-2xl border p-6 sm:p-8">
              <h2 className="font-display mb-4 text-xl font-semibold tracking-[-0.01em]">{section.title}</h2>
              <div className="text-fg-2 flex flex-col gap-3 leading-relaxed">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`}>{renderWithLinks(paragraph)}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {children}
      </div>
    </div>
  );
}
