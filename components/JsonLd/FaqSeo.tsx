import type { FaqItem } from '@/components/Faq';

import { JsonLd } from './JsonLd';

type FaqSeoProps = {
  items: FaqItem[];
};

/** FAQPage structured data, fed with the same items as the visible FAQ so the two cannot drift. */
export default function FaqSeo({ items }: FaqSeoProps) {
  return (
    <JsonLd
      scriptKey="faq-json-ld"
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }}
    />
  );
}
