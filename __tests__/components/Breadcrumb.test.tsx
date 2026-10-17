import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { Breadcrumb } from '@/components/Breadcrumb';

import navigation from '../../messages/fr/navigation.json';
import { render, within } from '../test-utils';

const ITEMS = [
  { label: 'Services', href: '/services' },
  { label: 'Pricing', href: '/pricing' },
] as const;

const readJsonLd = (container: HTMLElement) =>
  JSON.parse(container.querySelector('#breadcrumb-json-ld')?.textContent ?? '{}') as Record<string, unknown>;

describe('Breadcrumb', () => {
  it('shows the trail from the home page, the current page last and unlinked', () => {
    const { getByRole } = render(<Breadcrumb items={[...ITEMS]} />);
    const nav = getByRole('navigation', { name: 'Breadcrumb' });
    const steps = within(nav).getAllByRole('listitem');

    expect(steps.map((step) => step.textContent)).toEqual(['Home', '›Services', '›Pricing']);
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(within(nav).queryByRole('link', { name: 'Pricing' })).not.toBeInTheDocument();
    expect(within(nav).getByText('Pricing')).toHaveAttribute('aria-current', 'page');
  });

  it('hides the separators from assistive technologies', () => {
    const { getAllByText } = render(<Breadcrumb items={[...ITEMS]} />);

    for (const separator of getAllByText('›')) expect(separator).toHaveAttribute('aria-hidden', 'true');
  });

  it('declares the same trail to search engines, with the canonical URLs', () => {
    const { container } = render(<Breadcrumb items={[...ITEMS]} />);

    expect(readJsonLd(container)).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gocosmic.dev/en' },
        { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.gocosmic.dev/en/services' },
        { '@type': 'ListItem', position: 3, name: 'Pricing', item: 'https://www.gocosmic.dev/en/pricing' },
      ],
    });
  });

  it('speaks the language of the page, at its Swiss URLs', () => {
    const swissFrench = ({ children }: { children: ReactNode }) => (
      <NextIntlClientProvider locale="fr-CH" messages={navigation}>
        {children}
      </NextIntlClientProvider>
    );
    const { container, getByRole } = render(<Breadcrumb items={[{ label: 'Tarifs', href: '/pricing' }]} />, {
      wrapper: swissFrench,
    });

    expect(getByRole('navigation', { name: "Fil d'Ariane" })).toBeInTheDocument();
    expect(readJsonLd(container).itemListElement).toEqual([
      expect.objectContaining({ name: 'Accueil', item: 'https://www.gocosmic.dev/fr-ch' }),
      expect.objectContaining({ name: 'Tarifs', item: 'https://www.gocosmic.dev/fr-ch/tarifs' }),
    ]);
  });
});
