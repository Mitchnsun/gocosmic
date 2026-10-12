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

  it('declares the service with its starting monthly price', () => {
    render(<ServiceSeo description="Sites and apps" currency="eur" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'service-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': 'https://www.gocosmic.dev/en/services#service',
        name: 'Services & pricing',
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
            unitCode: 'MON',
            valueAddedTaxIncluded: false,
          },
        },
      },
    });
  });

  it('quotes Swiss francs on the Swiss pages', () => {
    render(<ServiceSeo description="Sites" currency="chf" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          offers: expect.objectContaining({ priceSpecification: expect.objectContaining({ priceCurrency: 'CHF' }) }),
        }),
      })
    );
  });
});
