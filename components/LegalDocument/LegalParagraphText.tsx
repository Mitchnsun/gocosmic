import { renderWithLinks } from '@/lib/renderWithLinks';

import type { LegalParagraph } from './LegalDocument.types';

/** A paragraph of a legal page, opened by its bold lead when it has one, or a bulleted list. */
export function LegalParagraphText({ paragraph }: { paragraph: LegalParagraph }) {
  if (typeof paragraph === 'string') return <p>{renderWithLinks(paragraph)}</p>;
  if ('items' in paragraph) {
    return (
      <ul className="flex flex-col gap-2">
        {paragraph.items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="bg-fg-3 mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" aria-hidden="true" />
            <span>{renderWithLinks(item)}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <p>
      {paragraph.lead && <strong className="text-fg font-semibold">{paragraph.lead} </strong>}
      {renderWithLinks(paragraph.text)}
    </p>
  );
}
