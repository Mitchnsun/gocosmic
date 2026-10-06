import { vi } from 'vitest';

import LocalBusinessSeo from '@/components/JsonLd/LocalBusinessSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <script data-testid="local-business-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('next-seo', () => ({
  JsonLdScript: (props: unknown) => jsonLdScriptMock(props),
}));

describe('LocalBusinessSeo', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render ProfessionalService JSON-LD for english locale', () => {
    const { getByTestId } = render(<LocalBusinessSeo locale="en" />);

    expect(getByTestId('local-business-json-ld')).toBeInTheDocument();
    expect(jsonLdScriptMock).toHaveBeenCalledWith({
      scriptKey: 'local-business-json-ld',
      data: {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        '@id': 'https://www.gocosmic.dev/#company',
        name: 'Cosmic Studio',
        alternateName: 'Go Cosmic',
        description:
          'Web and mobile studio based in Chêne-Bougeries, near Geneva. Websites and apps for craftspeople, associations and independents in French-speaking Switzerland and Haute-Savoie, including Annecy.',
        url: 'https://www.gocosmic.dev',
        image: 'https://www.gocosmic.dev/og-default.jpg',
        email: 'contact@gocosmic.dev',
        founder: { '@type': 'Person', '@id': 'https://www.gocosmic.dev/#person', name: 'Matthieu Compérat' },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Chêne-Bougeries',
          postalCode: '1224',
          addressRegion: 'GE',
          addressCountry: 'CH',
        },
        areaServed: ['Geneva', 'French-speaking Switzerland', 'Haute-Savoie', 'Annecy'],
        sameAs: ['https://www.linkedin.com/in/matthieucomperat/'],
      },
    });
  });

  it('should render localized ProfessionalService JSON-LD for french locale', () => {
    render(<LocalBusinessSeo locale="fr" />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          description:
            'Studio web et mobile installé à Chêne-Bougeries, près de Genève. Sites et applications pour les artisans, associations et indépendants de Suisse romande et de Haute-Savoie, notamment à Annecy.',
          areaServed: ['Genève', 'Suisse romande', 'Haute-Savoie', 'Annecy'],
        }),
      })
    );
  });

  it.each([
    ['de', ['Genf', 'Westschweiz', 'Hochsavoyen', 'Annecy']],
    ['it', ['Ginevra', 'Svizzera romanda', 'Alta Savoia', 'Annecy']],
    ['es', ['Ginebra', 'Suiza romanda', 'Alta Saboya', 'Annecy']],
  ])('should name the served areas in %s', (locale, areaServed) => {
    render(<LocalBusinessSeo locale={locale} />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ url: 'https://www.gocosmic.dev', areaServed }),
      })
    );
  });
});
