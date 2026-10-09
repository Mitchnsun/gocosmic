import { BRAND_NAME, CONTACT_EMAIL, FOUNDER_NAME, LEGACY_BRAND_NAME, SITE_URL, STUDIO_ADDRESS } from '@/lib/config';

import { JsonLd } from './JsonLd';
import { getLocalizedLocalBusinessData } from './JsonLd.utils';

interface LocalBusinessSeoProps {
  locale: string;
}

export default function LocalBusinessSeo({ locale }: LocalBusinessSeoProps) {
  const { description, areaServed } = getLocalizedLocalBusinessData(locale);

  return (
    <JsonLd
      scriptKey="local-business-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}/#company`,
        name: BRAND_NAME,
        alternateName: LEGACY_BRAND_NAME,
        description,
        url: SITE_URL,
        image: `${SITE_URL}/og-default.jpg`,
        email: CONTACT_EMAIL,
        founder: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: FOUNDER_NAME },
        address: { '@type': 'PostalAddress', ...STUDIO_ADDRESS },
        areaServed,
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      }}
    />
  );
}
