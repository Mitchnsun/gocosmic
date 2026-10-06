import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { CosmicCursorGate } from '@/components/CosmicCursor';

const pathname = vi.hoisted(() => ({ current: '/' }));

vi.mock('@/i18n/navigation', () => ({ usePathname: () => pathname.current }));
vi.mock('@/components/CosmicCursor/CosmicCursor', () => ({ default: () => <canvas data-testid="cosmic-cursor" /> }));

describe('CosmicCursorGate', () => {
  it('renders the custom cursor on the site pages', () => {
    pathname.current = '/services';
    const { queryByTestId } = render(<CosmicCursorGate />);

    expect(queryByTestId('cosmic-cursor')).toBeInTheDocument();
  });

  it('keeps the native cursor on the design system page', () => {
    pathname.current = '/design-system';
    const { queryByTestId } = render(<CosmicCursorGate />);

    expect(queryByTestId('cosmic-cursor')).not.toBeInTheDocument();
  });
});
