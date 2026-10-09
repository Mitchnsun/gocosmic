import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { buildHeroFacts, FactsLine } from '@/components/FactsLine';

describe('FactsLine', () => {
  it('lists every fact with its highlighted figure and label', () => {
    render(
      <FactsLine
        facts={[
          { highlight: 'Dès 10 € HT', text: '/ mois' },
          { highlight: 'Un seul', text: 'interlocuteur' },
        ]}
      />
    );

    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Dès 10 € HT / mois');
    expect(screen.getByText('Un seul')).toBeInTheDocument();
  });
});

describe('buildHeroFacts', () => {
  it('fills the price and picks the area of the region', () => {
    const t = (key: string, values?: Record<string, string>) => `${key}|${values?.price ?? ''}`;

    expect(buildHeroFacts(t, 'ch', '10 CHF')).toEqual([
      { highlight: 'hero.facts.price.highlight|10 CHF', text: 'hero.facts.price.text|' },
      { highlight: 'hero.facts.reply.highlight|10 CHF', text: 'hero.facts.reply.text|' },
      { highlight: 'hero.facts.contact.highlight|10 CHF', text: 'hero.facts.contact.text|' },
      { highlight: 'hero.facts.area.ch.highlight|10 CHF', text: 'hero.facts.area.ch.text|' },
    ]);
  });
});
