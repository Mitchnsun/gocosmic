import { describe, expect, it } from 'vitest';

import { OFFER_DEFINITIONS, SERVICE_DETAIL_DEFINITIONS, ServiceDetail } from '@/components/ServiceDetail';

import offersMessages from '../../messages/en/offers.json';
import { render } from '../test-utils';

describe('ServiceDetail', () => {
  const groups = [
    { label: 'Technologies', items: ['React', 'Next.js'] },
    { label: 'Outcomes', items: ['Faster pages'] },
  ];

  it('renders the heading, positioning line and every group', () => {
    const { getByRole, getByText, getAllByRole } = render(
      <ServiceDetail
        id="development"
        index="01 / 04"
        title="Stellar Development"
        subtitle="Modern web excellence"
        description="We build robust applications."
        groups={groups}
        accent="jungle"
      />
    );

    expect(getByRole('heading', { level: 2, name: 'Stellar Development' })).toBeInTheDocument();
    // Each bullet group stays reachable by heading navigation, under the service's h2.
    expect(getByRole('heading', { level: 3, name: 'Technologies' })).toBeInTheDocument();
    expect(getByRole('heading', { level: 3, name: 'Outcomes' })).toBeInTheDocument();
    expect(getByText('Modern web excellence')).toBeInTheDocument();
    expect(getByText('We build robust applications.')).toBeInTheDocument();
    expect(getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders the icon when provided', () => {
    const { getByTestId } = render(
      <ServiceDetail
        id="design"
        index="02 / 04"
        title="Design"
        subtitle="Immersive"
        description="Design work."
        groups={groups}
        icon={<span data-testid="service-icon" />}
      />
    );

    expect(getByTestId('service-icon')).toBeInTheDocument();
  });
});

describe('SERVICE_DETAIL_DEFINITIONS', () => {
  it('declares the four services expected by the homepage grid links', () => {
    expect(SERVICE_DETAIL_DEFINITIONS.map((service) => service.anchor)).toEqual([
      'development',
      'design',
      'ai',
      'launch',
    ]);
  });

  it('gives every service three bullet groups', () => {
    for (const service of SERVICE_DETAIL_DEFINITIONS) {
      expect(service.groups).toHaveLength(3);
      for (const group of service.groups) {
        expect(group.items.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('OFFER_DEFINITIONS', () => {
  it('declares the three offers in the order the footer links to them', () => {
    expect(OFFER_DEFINITIONS.map((offer) => offer.anchor)).toEqual([
      'solo-developer',
      'developer-designer',
      'team-developers',
    ]);
    expect(OFFER_DEFINITIONS.map((offer) => offer.accent)).toEqual(['aerospace', 'royal', 'jungle']);
  });

  it('gives every offer a features group and an ideal-for group', () => {
    for (const offer of OFFER_DEFINITIONS) {
      expect(offer.groups.map((group) => group.key)).toEqual(['features', 'ideal_for']);
    }
  });

  it('only references translation keys that exist', () => {
    const offers = offersMessages.offers as unknown as Record<string, Record<string, { items: object } | undefined>>;

    for (const offer of OFFER_DEFINITIONS) {
      for (const group of offer.groups) {
        const items = Object.keys(offers[offer.key]?.[group.key]?.items ?? {});
        expect(items.sort()).toEqual([...group.items].sort());
      }
    }
  });
});
