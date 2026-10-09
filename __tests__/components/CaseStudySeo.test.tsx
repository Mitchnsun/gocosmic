import { vi } from 'vitest';

import CaseStudySeo from '@/components/JsonLd/CaseStudySeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <div data-testid="case-study-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

describe('CaseStudySeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('describes the case study and its breadcrumb trail', () => {
    const { getByTestId } = render(<CaseStudySeo slug="mcomperat" />);

    expect(getByTestId('case-study-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'case-study-json-ld-mcomperat',
      data: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CreativeWork',
            '@id': 'https://www.gocosmic.dev/en/projects/mcomperat#work',
            name: 'mcomper.at',
            description:
              'An online résumé in French and English, quick to load. We use it to test the tools we then use for our clients.',
            genre: 'Website',
            dateCreated: '2026',
            url: 'https://www.gocosmic.dev/en/projects/mcomperat',
            inLanguage: 'en',
            creator: { '@id': 'https://www.gocosmic.dev/#company' },
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.gocosmic.dev/en' },
              { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://www.gocosmic.dev/en/projects' },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'mcomper.at',
                item: 'https://www.gocosmic.dev/en/projects/mcomperat',
              },
            ],
          },
        ],
      },
    });
  });

  it('declares the latest version of a project that keeps being updated', () => {
    render(<CaseStudySeo slug="daily-fortune" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          '@graph': expect.arrayContaining([
            expect.objectContaining({ dateCreated: '2025', version: '1.4.0', dateModified: '2026-02-28' }),
          ]),
        }),
      })
    );
  });
});
