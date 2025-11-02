import { getTranslations } from 'next-intl/server';
import { vi } from 'vitest';

import MComperat, { generateMetadata } from '@/app/[locale]/projects/mcomperat/page';

import { render } from '../test-utils';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}));

const mockGetTranslations = vi.mocked(getTranslations);

describe('MComperat Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the mcomperat page correctly', () => {
    const { container } = render(<MComperat />);

    expect(container).toMatchSnapshot();
  });

  it('should generate metadata correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockT = vi.fn() as any;
    mockT.mockReturnValueOnce('mcomper.at');
    mockT.mockReturnValueOnce('Modern, responsive web CV of Matthieu Compérat');

    mockGetTranslations.mockResolvedValue(mockT);

    const params = Promise.resolve({ locale: 'en' });
    const metadata = await generateMetadata({ params });

    expect(mockGetTranslations).toHaveBeenCalledWith({ locale: 'en', namespace: 'mcomperat' });
    expect(mockT).toHaveBeenCalledWith('title');
    expect(mockT).toHaveBeenCalledWith('subtitle');
    expect(metadata).toEqual({
      title: 'mcomper.at',
      description: 'Modern, responsive web CV of Matthieu Compérat',
    });
  });
});
