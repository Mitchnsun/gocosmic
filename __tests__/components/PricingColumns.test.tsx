import { PricingColumns } from '@/components/PricingColumns';
import { buildPricingColumns } from '@/components/PricingColumns/PricingColumns.utils';

import { render } from '../test-utils';

/** Echoes the key and its values, so the test can check what the builder asked for. */
const fakeT = (key: string, values?: Record<string, string>) =>
  values ? `${key}(${Object.values(values).join('|')})` : key;

describe('buildPricingColumns', () => {
  it('prices the subscription from the base price and the project floors, in euros', () => {
    const { subscription, project } = buildPricingColumns(fakeT, 'fr', 'fr');

    expect(subscription.price).toBe('subscription.price(10€)');
    expect(subscription.cta.href).toEqual({ pathname: '/services', hash: 'simulator' });
    expect(project.features[0]).toBe('project.features.floors(3 500€|5 000€|8 000€)');
    expect(project.cta.href).toBe('/contact');
  });

  it('switches to Swiss francs for Swiss visitors', () => {
    const { subscription, project } = buildPricingColumns(fakeT, 'ch', 'en');

    expect(subscription.price).toBe('subscription.price(10 CHF)');
    expect(project.features[0]).toBe('project.features.floors(3,500 CHF|5,000 CHF|8,000 CHF)');
  });
});

describe('PricingColumns', () => {
  const column = (label: string) => ({
    label,
    price: `${label} price`,
    description: `${label} description`,
    features: [`${label} feature`],
    cta: { text: `${label} cta`, href: '/contact' as const },
  });

  it('renders the highlighted subscription and the neutral project column', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <PricingColumns
        eyebrow="[ Pricing ]"
        title="Two ways"
        subscription={{ ...column('Subscription'), period: '/ month' }}
        project={column('Project')}
      />
    );

    expect(getByRole('region', { name: 'Two ways' })).toBeInTheDocument();
    const [subscription, project] = getAllByRole('article');
    expect(subscription).toHaveClass('border-aerospace/40');
    expect(project).toHaveClass('border-ghost/10');
    expect(getByText('/ month')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Subscription cta' })).toHaveClass('bg-aerospace');
    expect(getByRole('link', { name: 'Project cta' })).toHaveClass('border-ghost/15');
  });
});
