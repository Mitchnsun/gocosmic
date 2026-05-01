import { vi } from 'vitest';

import Services, { generateMetadata } from '@/app/[locale]/services/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  return {
    ...actual,
    getTranslations: vi.fn().mockResolvedValue((key: string) => {
      if (key === 'meta.title') return 'Web & Mobile Development Services | Annecy · Geneva | Go Cosmic';
      if (key === 'meta.description')
        return 'Comprehensive web and mobile development services based in Annecy, serving Geneva and Haute-Savoie. React, React Native, Next.js, AI integration.';
      if (key === 'title') return 'Our Cosmic Services';
      if (key === 'subtitle') return 'Comprehensive technical solutions to propel your projects into the stratosphere';
      return key;
    }),
  };
});

describe('Services Page', () => {
  it('should render the services page with all sections', () => {
    const { getByRole, getByText, getAllByText } = render(<Services />);

    // Check main heading
    expect(getByRole('heading', { name: /our cosmic services/i, level: 1 })).toBeInTheDocument();

    // Check all service sections
    expect(getByRole('heading', { name: /stellar development/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /mystical ui\/ux design/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /ai powered solutions/i, level: 2 })).toBeInTheDocument();
    expect(getByRole('heading', { name: /cosmic launch/i, level: 2 })).toBeInTheDocument();

    // Check CTA section
    expect(getByRole('heading', { name: /ready to launch your next cosmic project/i })).toBeInTheDocument();
    expect(getByText(/start your cosmic journey/i)).toBeInTheDocument();
    expect(getByText(/get a custom quote/i)).toBeInTheDocument();

    // Check some key technical content (using getAllByText since there are multiple occurrences)
    expect(getByText(/react 19, next\.js 15, typescript/i)).toBeInTheDocument();
    expect(getAllByText(/100% test coverage/i)).toHaveLength(2); // Appears in two places
    expect(getByText(/wcag compliance/i)).toBeInTheDocument();
  });

  describe('generateMetadata', () => {
    it('should generate metadata with correct title and description', async () => {
      const params = Promise.resolve({ locale: 'en' });
      const metadata = await generateMetadata({ params });

      expect(metadata).toEqual({
        title: 'Web & Mobile Development Services | Annecy · Geneva | Go Cosmic',
        description:
          'Comprehensive web and mobile development services based in Annecy, serving Geneva and Haute-Savoie. React, React Native, Next.js, AI integration.',
      });
    });
  });
});
