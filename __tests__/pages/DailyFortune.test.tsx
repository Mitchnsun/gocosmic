import { getTranslations } from 'next-intl/server';
import { vi } from 'vitest';

import DailyFortune, { generateMetadata } from '@/app/[locale]/projects/daily-fortune/page';

import { render } from '../test-utils';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}));

const mockGetTranslations = vi.mocked(getTranslations);

describe('DailyFortune Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the daily fortune page correctly', () => {
    const { container } = render(<DailyFortune />);

    expect(container).toMatchSnapshot();
  });

  it('should generate metadata correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockT = vi.fn() as any;
    mockT.mockReturnValueOnce('Daily Fortune');
    mockT.mockReturnValueOnce('Your daily dose of inspiration and cosmic wisdom');

    mockGetTranslations.mockResolvedValue(mockT);

    const params = Promise.resolve({ locale: 'en' });
    const metadata = await generateMetadata({ params });

    expect(mockGetTranslations).toHaveBeenCalledWith({ locale: 'en', namespace: 'dailyFortune' });
    expect(mockT).toHaveBeenCalledWith('title');
    expect(mockT).toHaveBeenCalledWith('subtitle');
    expect(metadata).toEqual({
      title: 'Daily Fortune',
      description: 'Your daily dose of inspiration and cosmic wisdom',
    });
  });
});
