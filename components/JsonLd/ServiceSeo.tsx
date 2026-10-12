import { useLocale, useTranslations } from 'next-intl';

import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { getCanonicalUrl } from '@/i18n/canonical';
import { SITE_URL } from '@/lib/config';
import { getPriceLineName, getPriceLines } from '@/lib/pricing/price-list';
import { getCurrency, type Region } from '@/lib/region';

import { JsonLd } from './JsonLd';
import { getLocalizedLocalBusinessData } from './JsonLd.utils';

interface ServiceSeoProps {
  description: string;
  /** Region of the page: its currency, and the options it offers. */
  region: Region;
}

/** The studio's offer as a service: its starting monthly price, then every plan and option of the simulator. */
export default function ServiceSeo({ description, region }: ServiceSeoProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tBuilder = useTranslations('pricing.builder');
  const url = getCanonicalUrl(locale, '/services');
  const priceCurrency = getCurrency(region).toUpperCase();

  const monthlyOffer = (price: number, minimum = false) => ({
    '@type': 'Offer',
    price,
    priceCurrency,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price,
      priceCurrency,
      // A price that is a floor ("€40 or more").
      ...(minimum && { minPrice: price }),
      // UN/CEFACT code for a month: the price is a monthly subscription.
      unitCode: 'MON',
      // The page quotes the price excluding VAT.
      valueAddedTaxIncluded: false,
    },
  });

  return (
    <JsonLd
      scriptKey="service-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${url}#service`,
        name: t('link_services'),
        description,
        url,
        provider: { '@id': `${SITE_URL}/#company` },
        areaServed: getLocalizedLocalBusinessData(locale).areaServed,
        offers: monthlyOffer(BASE_PRICE),
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t('link_services'),
          itemListElement: getPriceLines(region).map((line) => ({
            ...monthlyOffer(line.price, line.orMore),
            name: getPriceLineName(tBuilder, line),
          })),
        },
      }}
    />
  );
}
