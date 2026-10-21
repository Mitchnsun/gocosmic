import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { CaseStudySeeAlso } from '@/components/CaseStudy';

import { FRENCH_MESSAGES } from '../../french-messages';
import { render, within } from '../../test-utils';

const french = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="fr" messages={FRENCH_MESSAGES}>
    {children}
  </NextIntlClientProvider>
);

describe('CaseStudySeeAlso', () => {
  it.each([
    ['choeurdespaysdumontblanc', ['/website-for-associations', '/showcase-website']],
    ['mcomperat', ['/website-for-freelancers', '/showcase-website']],
    ['psc-supersprint', ['/website-for-associations', '/app-development']],
    ['daily-fortune', ['/app-development']],
    ['coachnpulse', ['/website-redesign']],
  ] as const)('links %s to the pages it illustrates, on the French version', (slug, hrefs) => {
    const { getByRole } = render(<CaseStudySeeAlso slug={slug} />, { wrapper: french });
    const section = getByRole('region', { name: 'Voir aussi' });

    expect(
      within(section)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(hrefs);
  });

  it('names each page by its label, e.g. the choir mockup leads to the page for associations', () => {
    const { getByRole } = render(<CaseStudySeeAlso slug="choeurdespaysdumontblanc" />, { wrapper: french });

    expect(getByRole('link', { name: 'Site pour associations et clubs' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'Création de site vitrine' })).toBeInTheDocument();
  });

  it('shows nothing in a language those pages are not published in', () => {
    const { container } = render(<CaseStudySeeAlso slug="mcomperat" />);

    expect(container).toBeEmptyDOMElement();
  });
});
