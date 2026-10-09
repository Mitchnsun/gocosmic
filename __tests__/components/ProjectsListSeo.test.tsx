import { vi } from 'vitest';

import ProjectsListSeo from '@/components/JsonLd/ProjectsListSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <div data-testid="projects-list-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
}));

describe('ProjectsListSeo', () => {
  it('lists every case study in display order', () => {
    const { getByTestId } = render(<ProjectsListSeo />);

    expect(getByTestId('projects-list-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'projects-list-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Chœur des Pays du Mont Blanc',
            url: 'https://www.gocosmic.dev/en/projects/choeurdespaysdumontblanc',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Daily Fortune',
            url: 'https://www.gocosmic.dev/en/projects/daily-fortune',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'mcomper.at',
            url: 'https://www.gocosmic.dev/en/projects/mcomperat',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'PSC Supersprint',
            url: 'https://www.gocosmic.dev/en/projects/psc-supersprint',
          },
        ],
      },
    });
  });
});
