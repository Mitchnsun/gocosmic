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
    render(<ServiceSeo description="Sites and apps" region="fr" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'service-json-ld',
      data: expect.objectContaining({
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
      }),
    });
  });

  it('quotes Swiss francs on the Swiss pages', () => {
    render(<ServiceSeo description="Sites" region="ch" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          offers: expect.objectContaining({ priceSpecification: expect.objectContaining({ priceCurrency: 'CHF' }) }),
        }),
      })
    );
  });

  it('lists every plan and option of the simulator with its monthly price', () => {
    render(<ServiceSeo description="Sites" region="fr" />);

    const catalog = catalogOf();

    expect(catalog).toMatchObject({ '@type': 'OfferCatalog', name: 'Services & pricing' });
    expect(catalog.itemListElement[0]).toEqual({
      '@type': 'Offer',
      name: 'We take care of everything',
      price: 10,
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: 10,
        priceCurrency: 'EUR',
        unitCode: 'MON',
        valueAddedTaxIncluded: false,
      },
    });
    expect(catalog.itemListElement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'You stay in control', price: 20 }),
        expect.objectContaining({ name: 'Visit statistics · Every month', price: 50 }),
        expect.objectContaining({ name: 'Extra mailboxes', price: 10 }),
      ])
    );
  });

  it('prices each article rhythm with the content changes it forces', () => {
    render(<ServiceSeo description="Sites" region="fr" />);

    expect(catalogOf().itemListElement).toContainEqual(
      expect.objectContaining({
        name: 'AI-assisted articles · 1 article a day + Content changes included · As often as needed',
        price: 250,
        priceSpecification: expect.objectContaining({ price: 250 }),
      })
    );
  });

  it('marks the last page step as a minimum price', () => {
    render(<ServiceSeo description="Sites" region="fr" />);

    expect(catalogOf().itemListElement).toContainEqual(
      expect.objectContaining({
        name: 'Number of pages · 10 pages or more',
        priceSpecification: expect.objectContaining({ price: 40, minPrice: 40 }),
      })
    );
  });

  it('offers Swiss hosting on the Swiss pages only', () => {
    const offersSwissHosting = () =>
      catalogOf().itemListElement.some(({ name }) => name === 'Website hosted in Switzerland');

    render(<ServiceSeo description="Sites" region="fr" />);
    expect(offersSwissHosting()).toBe(false);

    vi.clearAllMocks();
    render(<ServiceSeo description="Sites" region="ch" />);
    expect(offersSwissHosting()).toBe(true);
  });
});

/** The offer catalog passed to the last rendered JSON-LD script. */
function catalogOf() {
  const [props] = jsonLdScriptMock.mock.lastCall as [{ data: Record<string, unknown> }];
  return props.data.hasOfferCatalog as { itemListElement: { name: string }[] } & Record<string, unknown>;
}
