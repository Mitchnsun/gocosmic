import LocalPage, { generateMetadata } from '@/app/[locale]/local/page';

import { render, screen } from '../test-utils';

describe('Local Page', () => {
  it('should render the local seo page content', () => {
    render(<LocalPage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /web & mobile developer in annecy and geneva/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /coverage area/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact your local web developer/i })).toHaveAttribute('href', '/contact');
  });

  describe('generateMetadata', () => {
    it('should generate metadata with local SEO title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Développeur Web & Mobile Annecy • Genève | Go Cosmic',
        description:
          "Matthieu Compérat, développeur freelance basé à Annecy. Création d'applications web et mobiles pour Annecy, Genève et la Haute-Savoie.",
        alternates: {
          canonical: 'https://www.gocosmic.dev/en/web-mobile-developer-annecy-geneva',
        },
      });
    });
  });
});
