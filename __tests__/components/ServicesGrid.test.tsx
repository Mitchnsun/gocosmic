import { ServicesGrid } from '@/components/ServicesGrid';

import { render } from '../test-utils';

describe('ServicesGrid', () => {
  it('renders numbered service cards with their tags and no coloured icons', () => {
    const { getByRole, getAllByRole, getByText, container } = render(
      <ServicesGrid
        eyebrow="[ What we do · 04 ]"
        title="Four trades"
        services={[
          { title: 'Showcase sites', description: 'Get found on Google', tags: ['Craftspeople', 'Associations'] },
          { title: 'Apps', description: 'On the phone', tags: ['iOS'] },
        ]}
      />
    );

    expect(getByRole('region', { name: 'Four trades' })).toHaveAttribute('id', 'trades');
    expect(getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)).toEqual([
      'Showcase sites',
      'Apps',
    ]);
    expect(getByText('/01')).toHaveAttribute('aria-hidden', 'true');
    expect(getByText('Craftspeople')).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeNull();
  });

  it('links a trade to its own page when it has one', () => {
    const { getAllByRole, getByRole } = render(
      <ServicesGrid
        eyebrow="[ What we do ]"
        title="Trades"
        services={[
          {
            title: 'Showcase sites',
            description: 'Get found',
            tags: [],
            link: { label: 'Showcase website design', href: '/pricing' },
          },
          { title: 'Shops', description: 'Sell online', tags: [] },
        ]}
      />
    );

    expect(getByRole('link', { name: 'Showcase website design' })).toHaveAttribute('href', '/pricing');
    expect(getAllByRole('link')).toHaveLength(1);
  });
});
