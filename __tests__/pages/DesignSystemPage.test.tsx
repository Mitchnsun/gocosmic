import { notFound } from 'next/navigation';
import { vi } from 'vitest';

import DesignSystemPage, { generateMetadata } from '@/app/[locale]/design-system/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn(async () =>
    Object.assign((key: string) => key, { raw: () => [], rich: (key: string) => key })
  ),
}));

const mockNotFound = vi.mocked(notFound);
const params = Promise.resolve({ locale: 'en' });

describe('DesignSystemPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('answers 404 in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    await expect(DesignSystemPage()).rejects.toThrow('NEXT_NOT_FOUND');
    await expect(generateMetadata({ params })).rejects.toThrow('NEXT_NOT_FOUND');
    expect(mockNotFound).toHaveBeenCalledTimes(2);
  });

  it('renders outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    await expect(DesignSystemPage()).resolves.toBeTruthy();
    await expect(generateMetadata({ params })).resolves.toMatchObject({ robots: { index: false, follow: false } });
    expect(mockNotFound).not.toHaveBeenCalled();
  });
});
