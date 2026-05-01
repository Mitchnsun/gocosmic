import { vi } from 'vitest';

import Projects, { generateMetadata } from '@/app/[locale]/projects/page';

import { render } from '../test-utils';

vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({
    projectsList: {
      meta: {
        title: 'Our Projects | Go Cosmic — Annecy · Geneva',
        description:
          'Explore Go Cosmic projects — web and mobile apps crafted in Annecy, serving clients in Geneva and Haute-Savoie.',
      },
      title: 'Our Projects',
      subtitle: 'Explore the constellation of digital experiences crafted by Go Cosmic.',
      items: {
        dailyFortune: {
          title: 'Daily Fortune',
          description: 'A mobile app delivering daily cosmic fortunes.',
        },
        mcomperat: {
          title: 'mcomper.at',
          description: 'A modern, responsive web CV.',
        },
        pscSupersprint: {
          title: 'PSC Supersprint',
          description: 'A web application for triathlon competition results.',
        },
        choeurDesPaysduMontBlanc: {
          title: 'Chœur des Pays du Mont Blanc',
          description: "A website showcasing the choir's activities.",
        },
      },
    },
  }),
}));

describe('Projects Page', () => {
  it('should render the projects page correctly', () => {
    const { container } = render(<Projects />);

    expect(container).toMatchSnapshot();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Our Projects | Go Cosmic — Annecy · Geneva',
        description:
          'Explore Go Cosmic projects — web and mobile apps crafted in Annecy, serving clients in Geneva and Haute-Savoie.',
      });
    });
  });
});
