import { vi } from 'vitest';

import FaqSeo from '@/components/JsonLd/FaqSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <div data-testid="faq-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

describe('FaqSeo', () => {
  it('should render FAQPage JSON-LD with one Question per item', () => {
    const { getByTestId } = render(
      <FaqSeo
        items={[
          { question: 'Do I own the site?', answer: 'Yes.' },
          { question: 'How long?', answer: 'Two weeks.' },
        ]}
      />
    );

    expect(getByTestId('faq-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'faq-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          { '@type': 'Question', name: 'Do I own the site?', acceptedAnswer: { '@type': 'Answer', text: 'Yes.' } },
          { '@type': 'Question', name: 'How long?', acceptedAnswer: { '@type': 'Answer', text: 'Two weeks.' } },
        ],
      },
    });
  });
});
