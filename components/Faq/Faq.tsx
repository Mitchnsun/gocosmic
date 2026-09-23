'use client';

import type { ReactNode } from 'react';
import { useId, useState } from 'react';

import { SectionHeading } from '@/components/SectionHeading';
import { cn } from '@/design-system/lib/utils';
import { CONTAINER, SECTION_Y } from '@/design-system/pill';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  eyebrow: string;
  title: ReactNode;
  items: FaqItem[];
  /** Index of the answer open on load; `-1` keeps them all closed. Defaults to the first one. */
  defaultOpen?: number;
  id?: string;
}

/** Accessible accordion: each question is a button driving its answer region. One answer open at a time. */
export function Faq({ eyebrow, title, items, defaultOpen = 0, id = 'faq' }: FaqProps) {
  const [open, setOpen] = useState(defaultOpen);
  const baseId = useId();
  const titleId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={titleId} className={SECTION_Y}>
      <div className={cn(CONTAINER, 'grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]')}>
        <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />
        <ul className="border-ghost/10 flex flex-col border-t">
          {items.map((item, index) => {
            const isOpen = open === index;
            const buttonId = `${baseId}-question-${index}`;
            const panelId = `${baseId}-answer-${index}`;

            return (
              <li key={item.question} className="border-ghost/10 border-b">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : index)}
                    className="font-display focus-visible:ring-aerospace/70 flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-5 text-left text-lg font-medium focus-visible:ring-2 focus-visible:outline-none">
                    {item.question}
                    <span aria-hidden="true" className="text-aerospace font-mono text-xl">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="text-ghost/70 max-w-[65ch] pb-6 leading-relaxed">
                  {item.answer}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
