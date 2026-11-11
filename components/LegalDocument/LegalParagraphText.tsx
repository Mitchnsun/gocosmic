import { renderWithLinks } from '@/lib/renderWithLinks';

import type { LegalParagraph } from './LegalDocument.types';

/** A paragraph of a legal page, opened by its bold lead when it has one. */
export function LegalParagraphText({ paragraph }: { paragraph: LegalParagraph }) {
  if (typeof paragraph === 'string') return <p>{renderWithLinks(paragraph)}</p>;
  return (
    <p>
      {paragraph.lead && <strong className="text-fg font-semibold">{paragraph.lead} </strong>}
      {renderWithLinks(paragraph.text)}
    </p>
  );
}
