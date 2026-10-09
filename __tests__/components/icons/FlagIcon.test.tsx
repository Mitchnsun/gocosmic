import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import FlagIcon, { type FlagCode } from '@/components/icons/FlagIcon';

const CODES: FlagCode[] = ['gb', 'fr', 'es', 'de', 'it', 'ch', 'eu'];

describe('FlagIcon', () => {
  it.each(CODES)('renders a decorative svg for %s', (code) => {
    const { container } = render(<FlagIcon code={code} className="h-4 w-6" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('h-4', 'w-6');
    expect(svg?.children.length).toBeGreaterThan(0);
  });
});
