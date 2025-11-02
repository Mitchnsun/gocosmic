import { getTranslations } from 'next-intl/server';
import { vi } from 'vitest';

import ChoeurDesPaysduMontBlanc, { generateMetadata } from '@/app/[locale]/projects/choeurdespaysdumontblanc/page';

import { render } from '../test-utils';

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(),
}));

const mockGetTranslations = vi.mocked(getTranslations);

describe('ChoeurDesPaysduMontBlanc Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the choeur des pays du mont blanc page correctly', () => {
    const { container } = render(<ChoeurDesPaysduMontBlanc />);

    expect(container).toMatchSnapshot();
  });

  it('should generate metadata correctly', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockT = vi.fn() as any;
    mockT.mockReturnValueOnce('Chœur des Pays du Mont Blanc');
    mockT.mockReturnValueOnce('Website for the amateur choir based in Haute-Savoie, France');

    mockGetTranslations.mockResolvedValue(mockT);

    const params = Promise.resolve({ locale: 'en' });
    const metadata = await generateMetadata({ params });

    expect(mockGetTranslations).toHaveBeenCalledWith({ locale: 'en', namespace: 'choeurDesPaysduMontBlanc' });
    expect(mockT).toHaveBeenCalledWith('title');
    expect(mockT).toHaveBeenCalledWith('subtitle');
    expect(metadata).toEqual({
      title: 'Chœur des Pays du Mont Blanc',
      description: 'Website for the amateur choir based in Haute-Savoie, France',
    });
  });
});
