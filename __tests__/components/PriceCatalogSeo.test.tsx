import { vi } from 'vitest';

import PriceCatalogSeo from '@/components/JsonLd/PriceCatalogSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn<(props: unknown) => null>(() => null);

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

/** The JSON-LD passed to the last rendered script. */
function dataOf() {
  const [props] = jsonLdScriptMock.mock.lastCall as [{ scriptKey: string; data: Record<string, unknown> }];
  return props;
}

/** The offer catalog passed to the last rendered JSON-LD script. */
const catalogOf = () =>
  dataOf().data.hasOfferCatalog as { itemListElement: { name: string }[] } & Record<string, unknown>;

describe('PriceCatalogSeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('attaches the price list to the service the services page declares', () => {
    render(<PriceCatalogSeo region="fr" />);

    expect(dataOf()).toMatchObject({
      scriptKey: 'price-catalog-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': 'https://www.gocosmic.dev/en/services#service',
        name: 'Services',
        url: 'https://www.gocosmic.dev/en/services',
        provider: { '@id': 'https://www.gocosmic.dev/#company' },
      },
    });
    expect(catalogOf()).toMatchObject({
      '@type': 'OfferCatalog',
      '@id': 'https://www.gocosmic.dev/en/pricing#catalog',
      name: 'Pricing',
      url: 'https://www.gocosmic.dev/en/pricing',
    });
  });

  it('lists every plan and option of the simulator with its monthly price', () => {
    render(<PriceCatalogSeo region="fr" />);

    expect(catalogOf().itemListElement[0]).toEqual({
      '@type': 'Offer',
      name: 'We take care of everything',
      price: 10,
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: 10,
        priceCurrency: 'EUR',
        unitCode: 'MON',
      },
    });
    expect(catalogOf().itemListElement).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'You stay in control', price: 20 }),
        expect.objectContaining({ name: 'News published for you · 1 news item a month', price: 25 }),
        expect.objectContaining({ name: 'Visit statistics · Every month', price: 50 }),
        expect.objectContaining({ name: 'AI-assisted articles · 3 articles a week', price: 250 }),
        expect.objectContaining({ name: 'Extra mailboxes', price: 10 }),
      ])
    );
    expect(catalogOf().itemListElement.some(({ name }) => /monitoring/i.test(name))).toBe(false);
  });

  it('marks the last page step as a minimum price', () => {
    render(<PriceCatalogSeo region="fr" />);

    expect(catalogOf().itemListElement).toContainEqual(
      expect.objectContaining({
        name: 'Number of pages · 10 pages or more',
        priceSpecification: expect.objectContaining({ price: 40, minPrice: 40 }),
      })
    );
  });

  it('offers Swiss hosting on the Swiss pages only, in francs', () => {
    const offersSwissHosting = () =>
      catalogOf().itemListElement.some(({ name }) => name === 'Website hosted in Switzerland');

    render(<PriceCatalogSeo region="fr" />);
    expect(offersSwissHosting()).toBe(false);

    vi.clearAllMocks();
    render(<PriceCatalogSeo region="ch" />);
    expect(offersSwissHosting()).toBe(true);
    expect(catalogOf().itemListElement[0]).toMatchObject({ priceCurrency: 'CHF' });
  });
});
