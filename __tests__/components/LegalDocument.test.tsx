import { LegalDocument, type LegalSection } from '@/components/LegalDocument';

import { render, within } from '../test-utils';

const SECTIONS: LegalSection[] = [
  { title: 'Publisher', body: ['Hosted by Vercel: https://vercel.com/legal.'] },
  {
    id: 'contact',
    title: 'Contact',
    body: [
      { lead: 'Contact and recourse.', text: 'Write to us.' },
      { text: 'No lead here.' },
      { items: ['First item', 'Second item, see https://example.org/terms'] },
    ],
    links: [
      { label: 'Write to support@gocosmic.dev', href: 'mailto:support@gocosmic.dev' },
      { label: 'cnil.fr', href: 'https://www.cnil.fr' },
    ],
    children: <p>Further content</p>,
  },
];

const renderDocument = () =>
  render(
    <LegalDocument
      eyebrow="Moi Président"
      title="Legal notice"
      updated="Last updated: 11 November 2026"
      intro="Who publishes the game."
      sections={SECTIONS}
      banner={<p>Correction banner</p>}>
      <p>Closing note</p>
    </LegalDocument>
  );

describe('LegalDocument', () => {
  it('opens with the title, the update line and the intro, then one card per section', () => {
    const { getByRole, getAllByRole, getByText } = renderDocument();

    expect(getByRole('heading', { level: 1, name: 'Legal notice' })).toBeInTheDocument();
    expect(getByText('Last updated: 11 November 2026')).toBeInTheDocument();
    expect(getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Publisher',
      'Contact',
    ]);
  });

  it('keeps plain paragraphs as they are, links their addresses, and sets a lead in bold', () => {
    const { getByRole, getByText } = renderDocument();

    expect(getByRole('link', { name: 'https://vercel.com/legal' })).toHaveAttribute('target', '_blank');
    expect(getByText('Contact and recourse.').tagName).toBe('STRONG');
    expect(getByText('Contact and recourse.').parentElement).toHaveTextContent('Contact and recourse. Write to us.');
    expect(getByText('No lead here.').tagName).toBe('P');
  });

  it("gives a section its anchor, opens a site in a new tab and an address in the mail app, then the section's content", () => {
    const { getByRole, container } = renderDocument();
    const contact = container.querySelector<HTMLElement>('section#contact')!;

    expect(within(contact).getByRole('link', { name: 'cnil.fr' })).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(contact).getByRole('link', { name: 'Write to support@gocosmic.dev' })).not.toHaveAttribute('target');
    expect(within(contact).getByText('Further content')).toBeInTheDocument();
    expect(getByRole('link', { name: 'cnil.fr' })).toHaveAttribute('target', '_blank');
  });

  it('puts the banner before the sections and the closing note after them', () => {
    const { getByText } = renderDocument();
    const order = (a: string, b: string) =>
      getByText(a).compareDocumentPosition(getByText(b)) & Node.DOCUMENT_POSITION_FOLLOWING;

    expect(order('Correction banner', 'Publisher')).toBeTruthy();
    expect(order('Further content', 'Closing note')).toBeTruthy();
  });

  it('shows a bulleted list as a list, its addresses linked', () => {
    const { getByText } = renderDocument();
    const list = getByText('First item').closest('ul')!;

    expect(
      within(list)
        .getAllByRole('listitem')
        .map((item) => item.textContent)
    ).toEqual(['First item', 'Second item, see https://example.org/terms']);
    expect(within(list).getByRole('link', { name: 'https://example.org/terms' })).toHaveAttribute('target', '_blank');
  });

  it('starts a new line where the intro has one', () => {
    const { getByText } = render(
      <LegalDocument
        eyebrow="E"
        title="T"
        updated="U"
        intro={'Publisher: Cosmic Studio\nWhat follows.'}
        sections={[]}
      />
    );

    expect(getByText(/^Publisher: Cosmic Studio/)).toHaveClass('whitespace-pre-line');
  });
});
