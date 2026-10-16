import { useLocale, useTranslations } from 'next-intl';

import { getCanonicalUrl } from '@/i18n/canonical';
import { SITE_URL } from '@/lib/config';
import { getPriceLineName, getPriceLines } from '@/lib/pricing/price-list';
import { getCurrency, type Region } from '@/lib/region';

import { JsonLd } from './JsonLd';
import { monthlyOffer } from './JsonLd.utils';

interface PriceCatalogSeoProps {
  /** Region of the page: its currency, and the options it offers. */
  region: Region;
}

/**
 * Every plan and option of the simulator with its monthly price, on the pricing page, attached to the
 * service that the services page declares (`ServiceSeo`, same `@id`).
 */
export default function PriceCatalogSeo({ region }: PriceCatalogSeoProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tBuilder = useTranslations('pricing.builder');
  const serviceUrl = getCanonicalUrl(locale, '/services');
  const url = getCanonicalUrl(locale, '/pricing');
  const priceCurrency = getCurrency(region).toUpperCase();

  return (
    <JsonLd
      scriptKey="price-catalog-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${serviceUrl}#service`,
        name: t('link_services'),
        url: serviceUrl,
        provider: { '@id': `${SITE_URL}/#company` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          '@id': `${url}#catalog`,
          name: t('link_pricing'),
          url,
          itemListElement: getPriceLines(region).map((line) => ({
            ...monthlyOffer(line.price, priceCurrency, line.orMore),
            name: getPriceLineName(tBuilder, line),
          })),
        },
      }}
    />
  );
}
