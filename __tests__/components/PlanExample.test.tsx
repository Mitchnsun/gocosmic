import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

import { buildExamplePlan, PlanExample } from '@/components/ContentPage';
import { getMonthlyTotal } from '@/components/PricingSimulator/PricingSimulator.utils';

import { FRENCH_MESSAGES } from '../french-messages';
import { render } from '../test-utils';

const french = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="fr" messages={FRENCH_MESSAGES}>
    {children}
  </NextIntlClientProvider>
);

const swiss = ({ children }: { children: ReactNode }) => (
  <NextIntlClientProvider locale="fr-CH" messages={FRENCH_MESSAGES}>
    {children}
  </NextIntlClientProvider>
);

/** Text of an element, with the non-breaking spaces `Intl` puts in prices turned into plain ones. */
const text = (element: HTMLElement) => element.textContent.replace(/\s/g, ' ');

describe('buildExamplePlan', () => {
  it('gives every example a few pages and a domain name managed by the studio', () => {
    const plan = buildExamplePlan({ formula: 'managed', addOns: ['booking'] });

    expect(plan.ownDomain).toBe(false);
    expect(plan.addOns).toMatchObject({ domain: true, booking: true, email: false });
    expect(getMonthlyTotal(plan)).toBe(25);
  });

  it('keeps the simulator rules, e.g. no extra news charged with "You stay in control"', () => {
    const plan = buildExamplePlan({ formula: 'self_service', addOns: [] });

    expect(plan.news).toBeNull();
    expect(getMonthlyTotal(plan)).toBe(30);
  });
});

describe('PlanExample', () => {
  it('prices each line and the total with the current prices, says how long it commits, and links the simulator', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <PlanExample example={{ formula: 'managed', addOns: ['contact_form', 'reviews'] }} />,
      { wrapper: french }
    );

    expect(getByRole('list', { name: 'Exemple de composition' })).toBeInTheDocument();
    expect(getAllByRole('listitem').map(text)).toEqual([
      "On s'occupe de tout10 €",
      '2 à 4 pages+5 €',
      'Un formulaire de contact+5 €',
      'Les avis de vos clients sur votre site+5 €',
      'Gestion de votre nom de domaine+5 €',
    ]);
    expect(text(getByText('Total').parentElement!)).toBe('Total30 €/ mois');
    expect(getByText(/^Abonnement par périodes de 12 mois, car il comprend : nom de domaine\./)).toBeInTheDocument();
    expect(getByText(/^Exemple calculé avec les prix actuels du simulateur\./)).toBeInTheDocument();
    expect(getByRole('link', { name: 'Calculer mon prix' })).toHaveAttribute('href', '/pricing');
  });

  it('quotes Swiss francs on the Swiss version', () => {
    const { getByText } = render(<PlanExample example={{ formula: 'managed', addOns: [] }} />, { wrapper: swiss });

    expect(text(getByText('Total').parentElement!)).toBe('Total20 CHF/ mois');
  });
});
