import { PricingColumns } from '@/components/PricingColumns';
import { buildPricingColumns } from '@/components/PricingColumns/PricingColumns.utils';

import { render } from '../test-utils';

/** Echoes the key and its values, so the test can check what the builder asked for. */
const fakeT = (key: string, values?: Record<string, string>) =>
  values ? `${key}(${Object.values(values).join('|')})` : key;

describe('buildPricingColumns', () => {
  it('prices the subscription from the base price, in euros, the French way', () => {
    const [subscription, , , custom] = buildPricingColumns(fakeT, 'fr', 'fr');

    expect(subscription!.price).toMatch(/^subscription\.price\(10\s€\)$/);
    expect(subscription!.cta.href).toEqual({ pathname: '/services', hash: 'simulator' });
    expect(custom!.price).toBeUndefined();
    expect(custom!.cta.href).toBe('/contact');
  });

  it('switches to Swiss francs for Swiss visitors', () => {
    const [subscription] = buildPricingColumns(fakeT, 'ch', 'en');

    expect(subscription!.price).toMatch(/^subscription\.price\(CHF\s10\)$/);
  });

  it('builds the guidance and reinforcement columns without prices from amounts', () => {
    const [, guidance, reinforcement] = buildPricingColumns(fakeT, 'fr', 'fr');

    expect(guidance!.price).toBe('guidance.price');
    expect(reinforcement!.price).toBe('reinforcement.price');
  });
});

describe('PricingColumns', () => {
  const column = (title: string, price?: string) => ({
    title,
    label: `${title} label`,
    price,
    description: `${title} description`,
    features: [`${title} feature`],
    cta: { text: `${title} cta`, href: '/contact' as const },
  });

  it('renders the highlighted subscription and the other columns, price optional', () => {
    const { getByRole, getAllByRole, getByText, queryByText } = render(
      <PricingColumns
        eyebrow="[ Pricing ]"
        title="Several ways"
        columns={[
          { ...column('Subscription', 'Subscription price'), period: '/ month' },
          column('Guidance', 'Day rate'),
          column('Reinforcement', 'Day rate'),
          column('Custom'),
        ]}
      />
    );

    expect(getByRole('region', { name: 'Several ways' })).toBeInTheDocument();
    const articles = getAllByRole('article');
    expect(articles).toHaveLength(4);
    expect(articles[0]).toHaveClass('border-aerospace/40');
    expect(articles[1]).toHaveClass('border-line');
    expect(getByText('/ month')).toBeInTheDocument();
    expect(getByRole('heading', { name: 'Custom' })).toBeInTheDocument();
    expect(queryByText('Custom price')).not.toBeInTheDocument();
    expect(getByRole('link', { name: 'Subscription cta' })).toHaveClass('bg-aerospace');
  });
});
