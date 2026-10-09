import { vi } from 'vitest';

import LocalBusinessSeo from '@/components/JsonLd/LocalBusinessSeo';

import { render } from '../test-utils';

const jsonLdScriptMock = vi.fn((props: unknown) => (
  <div data-testid="local-business-json-ld" data-props={JSON.stringify(props)} />
));

vi.mock('@/components/JsonLd/JsonLd', () => ({
  JsonLd: (props: unknown) => jsonLdScriptMock(props),
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
        areaServed: ['Geneva', 'Annecy', 'Haute-Savoie', 'French-speaking Switzerland'],
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
          areaServed: ['Genève', 'Annecy', 'Haute-Savoie', 'Suisse romande'],
        }),
      })
    );
  });

  it.each([
    ['de', ['Genf', 'Annecy', 'Hochsavoyen', 'Westschweiz']],
    ['it', ['Ginevra', 'Annecy', 'Alta Savoia', 'Svizzera romanda']],
    ['es', ['Ginebra', 'Annecy', 'Alta Saboya', 'Suiza romanda']],
    ['fr-CH', ['Genève', 'Annecy', 'Haute-Savoie', 'Suisse romande']],
    ['de-CH', ['Genf', 'Annecy', 'Hochsavoyen', 'Westschweiz']],
  ])('should name the served areas in %s', (locale, areaServed) => {
    render(<LocalBusinessSeo locale={locale} />);

    expect(jsonLdScriptMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ url: 'https://www.gocosmic.dev', areaServed }),
      })
    );
  });
});
