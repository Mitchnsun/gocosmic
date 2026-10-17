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
    ['choeurdespaysdumontblanc', 'Création de site vitrine', '/showcase-website'],
    ['mcomperat', 'Création de site vitrine', '/showcase-website'],
    ['psc-supersprint', "Création d'application", '/app-development'],
    ['daily-fortune', "Création d'application", '/app-development'],
  ] as const)('links %s to the page it illustrates, on the French version', (slug, name, href) => {
    const { getByRole } = render(<CaseStudySeeAlso slug={slug} />, { wrapper: french });
    const section = getByRole('region', { name: 'Voir aussi' });

    expect(within(section).getByRole('link', { name })).toHaveAttribute('href', href);
  });

  it('shows nothing for a case study that illustrates no page', () => {
    const { container } = render(<CaseStudySeeAlso slug="coachnpulse" />, { wrapper: french });

    expect(container).toBeEmptyDOMElement();
  });

  it('shows nothing in a language those pages are not published in', () => {
    const { container } = render(<CaseStudySeeAlso slug="mcomperat" />);

    expect(container).toBeEmptyDOMElement();
  });
});
