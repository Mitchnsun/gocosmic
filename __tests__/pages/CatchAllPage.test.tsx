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
    const result = CatchAllPage();

    expect(mockNotFound).toHaveBeenCalledTimes(1);
    expect(mockNotFound).toHaveBeenCalledWith();

    // The component calls notFound() which should throw/redirect
    // so we don't expect any return value
    expect(result).toBeUndefined();
  });

  it('should handle multiple calls consistently', () => {
    CatchAllPage();
    CatchAllPage();
    CatchAllPage();

    expect(mockNotFound).toHaveBeenCalledTimes(3);
  });
});
