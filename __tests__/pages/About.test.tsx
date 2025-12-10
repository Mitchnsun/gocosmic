import { vi } from 'vitest';

import About, { generateMetadata } from '@/app/[locale]/about/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', () => ({
  getMessages: vi.fn().mockResolvedValue({
    meta: {
      title: 'About Go Cosmic - Our Mission and Team',
      description:
        "Discover Go Cosmic's mission to create stellar applications with AI. Meet Matthieu Compérat, our developer, and learn about our commitment to excellence and innovation.",
    },
  }),
}));

describe('About Page', () => {
  it('should render the about page correctly', () => {
    const { container } = render(<About />);

    expect(container).toMatchSnapshot();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'About Go Cosmic - Our Mission and Team',
        description:
          "Discover Go Cosmic's mission to create stellar applications with AI. Meet Matthieu Compérat, our developer, and learn about our commitment to excellence and innovation.",
      });
    });
  });
});
