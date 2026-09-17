import { describe, expect, it } from 'vitest';

import { SERVICE_DETAIL_DEFINITIONS, ServiceDetail } from '@/components/ServiceDetail';

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
