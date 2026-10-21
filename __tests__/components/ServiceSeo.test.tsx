import { vi } from 'vitest';

import ServiceSeo from '@/components/JsonLd/ServiceSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn<(props: unknown) => null>(() => null);

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

describe('ServiceSeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('declares the service with its starting monthly price, and leaves the price list to the pricing page', () => {
    render(<ServiceSeo description="Sites and apps" offer={{ price: 10, region: 'fr' }} />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'service-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': 'https://www.gocosmic.dev/en/services#service',
        name: 'Services',
        description: 'Sites and apps',
        url: 'https://www.gocosmic.dev/en/services',
        provider: { '@id': 'https://www.gocosmic.dev/#company' },
        areaServed: ['Geneva', 'Annecy', 'Haute-Savoie', 'French-speaking Switzerland'],
        offers: {
          '@type': 'Offer',
          price: 10,
          priceCurrency: 'EUR',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: 10,
            priceCurrency: 'EUR',
            minPrice: 10,
            unitCode: 'MON',
          },
        },
      },
    });
  });

  it('quotes Swiss francs on the Swiss pages', () => {
    render(<ServiceSeo description="Sites" offer={{ price: 10, region: 'ch' }} />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          offers: expect.objectContaining({ priceSpecification: expect.objectContaining({ priceCurrency: 'CHF' }) }),
        }),
      })
    );
  });

  it('declares one of the services on its own page, without a price when it is quoted on request', () => {
    render(<ServiceSeo route="/projects" name="Apps" description="Apps for your members" />);

    const [[{ data }]] = jsonLdScriptMock.mock.calls as [[{ data: Record<string, unknown> }]];
    expect(data).toMatchObject({
      '@id': 'https://www.gocosmic.dev/en/projects#service',
      name: 'Apps',
      url: 'https://www.gocosmic.dev/en/projects',
      provider: { '@id': 'https://www.gocosmic.dev/#company' },
    });
    expect(data.offers).toBeUndefined();
  });
});
