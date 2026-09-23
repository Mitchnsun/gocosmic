import { vi } from 'vitest';

import { AsciiMarquee } from '@/components/AsciiMarquee';

import { render } from '../test-utils';

const LABELS = ['Geneva', 'Free mockup', 'One point of contact'];
// Short lists are repeated up to 12 items per copy, and the track holds two copies.
const REPEATS = 4;

describe('AsciiMarquee', () => {
  it('is aria-hidden for screen readers', () => {
    const { container } = render(<AsciiMarquee labels={LABELS} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('repeats a short list so each half of the infinite-scroll loop fills the screen', () => {
    const { getAllByText } = render(<AsciiMarquee labels={LABELS} />);
    LABELS.forEach((label) => {
      expect(getAllByText(label)).toHaveLength(2 * REPEATS);
    });
  });

  it('does not repeat a list that is already long enough', () => {
    const labels = Array.from({ length: 12 }, (_, index) => `Label ${index}`);
    const { getAllByText } = render(<AsciiMarquee labels={labels} />);
    expect(getAllByText('Label 0')).toHaveLength(2);
  });

  it('renders the correct number of ✦ separators', () => {
    const { getAllByText } = render(<AsciiMarquee labels={LABELS} />);
    // Per copy: (N-1) between items + 1 trailing = N. Two copies → 2N.
    expect(getAllByText('✦')).toHaveLength(2 * LABELS.length * REPEATS);
  });

  it('keeps all labels present after the shuffle on mount', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const { getAllByText } = render(<AsciiMarquee labels={LABELS} />);
    LABELS.forEach((label) => {
      expect(getAllByText(label)).toHaveLength(2 * REPEATS);
    });
    vi.restoreAllMocks();
  });

  it('accepts a single label without crashing', () => {
    const { getAllByText } = render(<AsciiMarquee labels={['Go Cosmic']} />);
    expect(getAllByText('Go Cosmic')).toHaveLength(24);
  });
});
