import { useLocale, useTranslations } from 'next-intl';

import { BASE_PRICE } from '@/components/PricingSimulator/constants';
import { getCanonicalUrl } from '@/i18n/canonical';
import { SITE_URL } from '@/lib/config';
import { getCurrency, type Region } from '@/lib/region';

import { JsonLd } from './JsonLd';
import { getLocalizedLocalBusinessData, monthlyOffer } from './JsonLd.utils';

interface ServiceSeoProps {
  description: string;
  /** Region of the page: its currency. */
  region: Region;
}

/**
 * The studio's offer as a service, on the services page, with its starting monthly price. The price
 * of every plan and option is declared on the pricing page, under the same service (`PriceCatalogSeo`).
 */
export default function ServiceSeo({ description, region }: ServiceSeoProps) {
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
        offers: monthlyOffer(BASE_PRICE, getCurrency(region).toUpperCase()),
      }}
    />
  );
}
