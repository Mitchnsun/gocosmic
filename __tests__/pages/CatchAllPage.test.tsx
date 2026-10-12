import { notFound } from 'next/navigation';
import { vi } from 'vitest';

import CatchAllPage from '@/app/[locale]/[...rest]/page';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

const mockNotFound = vi.mocked(notFound);

describe('CatchAllPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call notFound function', () => {
    CatchAllPage();

    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockNotFound).toHaveBeenCalledWith();
  });

  it('should handle multiple calls consistently', () => {
    CatchAllPage();
    CatchAllPage();
    CatchAllPage();

    expect(mockNotFound).toHaveBeenCalledTimes(3);
  });
});
