import { vi } from 'vitest';

import { AsciiMarquee } from '@/components/AsciiMarquee';

import { render } from '../test-utils';

const LABELS = ['Next.js', 'TypeScript', 'Houston, we have a problem.'];

describe('AsciiMarquee', () => {
  it('is aria-hidden for screen readers', () => {
    const { container } = render(<AsciiMarquee labels={LABELS} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders each label twice for the infinite-scroll loop', () => {
    const { getAllByText } = render(<AsciiMarquee labels={LABELS} />);
    LABELS.forEach((label) => {
      expect(getAllByText(label)).toHaveLength(2);
    });
  });

  it('renders the correct number of ✦ separators', () => {
    const { getAllByText } = render(<AsciiMarquee labels={LABELS} />);
    // Per copy: (N-1) between items + 1 trailing = N. Two copies → 2N.
    expect(getAllByText('✦')).toHaveLength(2 * LABELS.length);
  });

  it('keeps all labels present after the shuffle on mount', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const { getAllByText } = render(<AsciiMarquee labels={LABELS} />);
    LABELS.forEach((label) => {
      expect(getAllByText(label)).toHaveLength(2);
    });
    vi.restoreAllMocks();
  });

  it('accepts a single label without crashing', () => {
    const { getAllByText } = render(<AsciiMarquee labels={['Go Cosmic']} />);
    expect(getAllByText('Go Cosmic')).toHaveLength(2);
  });
});
