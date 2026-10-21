import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { SourceList } from '@/components/ContentPage';

import { FRENCH_MESSAGES } from '../french-messages';
import { render, within } from '../test-utils';

const french = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="fr" messages={FRENCH_MESSAGES}>
    {children}
  </NextIntlClientProvider>
);

describe('SourceList', () => {
  it('links each source and gives the day it was read, in the page language', () => {
    const { getByRole } = render(
      <SourceList
        consulted="2026-10-21"
        sources={[
          { label: 'Wix help', href: 'https://support.wix.com/en/article/a' },
          { label: 'WordPress documentation', href: 'https://wordpress.org/documentation/article/b/' },
        ]}
      />,
      { wrapper: french }
    );
    const section = within(getByRole('region', { name: 'Sources' }));

    expect(section.getByRole('link', { name: 'Wix help' })).toHaveAttribute(
      'href',
      'https://support.wix.com/en/article/a'
    );
    expect(section.getAllByRole('link')).toHaveLength(2);
    expect(section.getByText('Consultées le 21 octobre 2026.')).toBeInTheDocument();
  });
});
