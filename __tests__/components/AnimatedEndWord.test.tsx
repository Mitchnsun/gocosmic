import { act } from '@testing-library/react';
import { vi } from 'vitest';

import AnimatedEndWord from '@/components/HeroSection/AnimatedEndWord';

import { render, screen } from '../test-utils';

describe('AnimatedEndWord', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the current word', () => {
    render(<AnimatedEndWord word="shine" className="text-white" prefersReducedMotion={false} />);
    expect(screen.getByText('shine')).toBeInTheDocument();
  });

  it('shows the previous word as an overlay during transition', () => {
    const { rerender } = render(<AnimatedEndWord word="shine" className="" prefersReducedMotion={false} />);
    rerender(<AnimatedEndWord word="soar" className="" prefersReducedMotion={false} />);
    expect(screen.getByText('shine')).toBeInTheDocument();
    expect(screen.getByText('soar')).toBeInTheDocument();
  });

  it('removes the previous word after the transition duration', () => {
    const { rerender } = render(<AnimatedEndWord word="shine" className="" prefersReducedMotion={false} />);
    rerender(<AnimatedEndWord word="soar" className="" prefersReducedMotion={false} />);
    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(screen.queryByText('shine')).not.toBeInTheDocument();
    expect(screen.getByText('soar')).toBeInTheDocument();
  });

  it('switches word instantly when prefersReducedMotion is true', () => {
    const { rerender } = render(<AnimatedEndWord word="shine" className="" prefersReducedMotion={true} />);
    rerender(<AnimatedEndWord word="soar" className="" prefersReducedMotion={true} />);
    expect(screen.queryByText('shine')).not.toBeInTheDocument();
    expect(screen.getByText('soar')).toBeInTheDocument();
  });

  it('applies the word-exit class to the outgoing span', () => {
    const { rerender } = render(<AnimatedEndWord word="shine" className="" prefersReducedMotion={false} />);
    rerender(<AnimatedEndWord word="soar" className="" prefersReducedMotion={false} />);
    const outgoing = screen.getByText('shine');
    expect(outgoing).toHaveClass('word-exit');
  });

  it('applies the word-enter class to the incoming span', () => {
    const { rerender } = render(<AnimatedEndWord word="shine" className="" prefersReducedMotion={false} />);
    rerender(<AnimatedEndWord word="soar" className="" prefersReducedMotion={false} />);
    const incoming = screen.getByText('soar');
    expect(incoming).toHaveClass('word-enter');
  });
});
