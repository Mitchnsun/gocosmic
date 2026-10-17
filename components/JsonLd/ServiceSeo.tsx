import { useLocale, useTranslations } from 'next-intl';

import { getCanonicalUrl } from '@/i18n/canonical';
import type { RouteKey } from '@/i18n/routing';
import { SITE_URL } from '@/lib/config';
import { getCurrency, type Region } from '@/lib/region';

import { JsonLd } from './JsonLd';
import { getLocalizedLocalBusinessData, monthlyOffer } from './JsonLd.utils';

interface ServiceSeoProps {
  description: string;
  /** Monthly price the service starts from, in the currency of the page's region; none for a service quoted on request. */
  offer?: { price: number; region: Region };
  /** Page presenting the service, and its name: the services page by default. */
  route?: RouteKey;
  name?: string;
}

/**
 * The studio's offer as a service, on the services page, with its starting monthly price, or one of its services
 * on its own page. The price of every plan and option is declared on the pricing page, under the services page's
 * service (`PriceCatalogSeo`).
 */
export default function ServiceSeo({ description, offer, route = '/services', name }: ServiceSeoProps) {
  const locale = useLocale();
  const t = useTranslations('footer');
  const url = getCanonicalUrl(locale, route);

  return (
    <JsonLd
      scriptKey="service-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'Service',
        '@id': `${url}#service`,
        name: name ?? t('link_services'),
        description,
        url,
        provider: { '@id': `${SITE_URL}/#company` },
        areaServed: getLocalizedLocalBusinessData(locale).areaServed,
        offers: offer && monthlyOffer(offer.price, getCurrency(offer.region).toUpperCase()),
      }}
    />
  );
}
