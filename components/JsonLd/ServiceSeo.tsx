import { useLocale, useTranslations } from 'next-intl';

import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { getCanonicalUrl } from '@/i18n/canonical';
import { SITE_URL } from '@/lib/config';
import type { Currency } from '@/lib/region';

import { JsonLd } from './JsonLd';
import { getLocalizedLocalBusinessData } from './JsonLd.utils';

interface ServiceSeoProps {
  description: string;
  currency: Currency;
}

/** The studio's offer as a service, with its starting monthly price in the page's currency. */
export default function ServiceSeo({ description, currency }: ServiceSeoProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const url = getCanonicalUrl(locale, '/services');

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
        offers: {
          '@type': 'Offer',
          price: BASE_PRICE,
          priceCurrency: currency.toUpperCase(),
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: BASE_PRICE,
            priceCurrency: currency.toUpperCase(),
            // UN/CEFACT code for a month: the price is a monthly subscription.
            unitCode: 'MON',
            // The page quotes the price excluding VAT.
            valueAddedTaxIncluded: false,
          },
        },
      }}
    />
  );
}
