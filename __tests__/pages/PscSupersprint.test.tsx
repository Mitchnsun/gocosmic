import { getTranslations } from 'next-intl/server';
import { vi } from 'vitest';

import PscSupersprint, { generateMetadata } from '@/app/[locale]/projects/psc-supersprint/page';

import { render } from '../test-utils';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}));

const mockGetTranslations = vi.mocked(getTranslations);

describe('PscSupersprint Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the psc supersprint page correctly', () => {
    const { container } = render(<PscSupersprint />);

    expect(container).toMatchSnapshot();
  });

  it('should generate metadata correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockT = vi.fn() as any;
    mockT.mockReturnValueOnce('PSC Supersprint');
    mockT.mockReturnValueOnce('Web application for managing PSC triathlon supersprint competition results');

    mockGetTranslations.mockResolvedValue(mockT);

    const params = Promise.resolve({ locale: 'en' });
    const metadata = await generateMetadata({ params });

    expect(mockGetTranslations).toHaveBeenCalledWith({ locale: 'en', namespace: 'pscSupersprint' });
    expect(mockT).toHaveBeenCalledWith('title');
    expect(mockT).toHaveBeenCalledWith('subtitle');
    expect(metadata).toEqual({
      title: 'PSC Supersprint',
      description: 'Web application for managing PSC triathlon supersprint competition results',
      alternates: {
        canonical: 'https://www.gocosmic.dev/en/projects/psc-supersprint',
      },
    });
  });
});
