import { vi } from 'vitest';

import Home from '@/app/[locale]/page';

import { render } from '../test-utils';

// Mock next-intl/server
vi.mock('next-intl/server', async () => {
  const actual = await vi.importActual('next-intl/server');
  const { default: commonMessages } = await import('../../messages/en/common.json');
  const { default: homeMessages } = await import('../../messages/en/home.json');
  return {
    ...actual,
    getLocale: vi.fn().mockResolvedValue('en'),
    getMessages: vi.fn().mockResolvedValue({ ...commonMessages, ...homeMessages }),
    getTranslations: vi.fn().mockImplementation(async () => {
      const messages: Record<string, string> = {
        'hero.title': 'We create stellar applications that shine',
        'hero.subtitle': 'Let us propel your ideas into the stratosphere',
        'hero.cta': 'Start your journey',
        'services.title': 'Our Cosmic Services',
        'services.development.title': 'Stellar Development',
        'services.development.description': 'Building robust mobile apps',
        'services.design.title': 'Mystical UI/UX Design',
        'services.design.description': 'Creating enchanting user experiences',
        'services.ai.title': 'AI-Powered',
        'services.ai.description': 'Integrating AI features',
        'services.launch.title': 'Cosmic Launch',
        'services.launch.description': 'Guiding your app through launch',
        'cta.title': 'Ready for Go Cosmic?',
        'cta.description': "Let's discuss your project",
        'cta.viewOffers': 'View our offers',
        'zone.title': 'Service area',
        'zone.description': 'Available in Annecy, Geneva, and Haute-Savoie.',
        'zone.locations.annecy': 'Annecy',
        'zone.locations.geneva': 'Geneva',
        'zone.locations.haute_savoie': 'Haute-Savoie',
      };
      // eslint-disable-next-line security/detect-object-injection
      return (key: string) => messages[key] ?? key;
    }),
  };
});

describe('Home Page', () => {
  it('should render the home page correctly', () => {
    const { getByText } = render(<Home />);

    expect(getByText(/available in annecy, geneva, and haute-savoie/i)).toBeInTheDocument();
  });
});
