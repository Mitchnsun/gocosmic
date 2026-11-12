import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

import type { LegalSection } from './LegalDocument.types';
import { LegalParagraphText } from './LegalParagraphText';

const LINK =
  'text-fg hover:text-aerospace-ink focus-visible:ring-aerospace-ink inline-flex min-h-11 items-center gap-1.5 rounded underline underline-offset-4 transition-colors focus-visible:ring-2 focus-visible:outline-none';

/** One section of a legal page: a card with its title, paragraphs, links and any further content. */
export function LegalSectionCard({ section }: { section: LegalSection }) {
  const { id, title, body, links = [], children } = section;

  return (
    <section id={id} className="border-line bg-surface scroll-mt-24 rounded-2xl border p-6 sm:p-8">
      <h2 className="font-display mb-4 text-xl font-semibold tracking-[-0.01em]">{title}</h2>
      <div className="text-fg-2 flex flex-col gap-3 leading-relaxed">
        {body.map((paragraph, index) => (
          <LegalParagraphText key={`${title}-${index}`} paragraph={paragraph} />
        ))}
      </div>
      {links.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-x-6">
          {links.map(({ label, href }) => {
            const isSite = href.startsWith('http');
            return (
              <li key={href}>
                <a href={href} {...(isSite && { target: '_blank', rel: 'noopener noreferrer' })} className={LINK}>
                  {label}
                  {isSite && <ArrowTopRightOnSquareIcon className="size-4" aria-hidden="true" />}
                </a>
              </li>
            );
          })}
        </ul>
      )}
      {children}
    </section>
  );
}
