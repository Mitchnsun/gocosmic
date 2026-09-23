import { act } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

import { Reveal } from '@/components/Reveal';

import { render } from '../test-utils';

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;

describe('Reveal', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the content at once when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { getByText } = render(<Reveal>Hello</Reveal>);

    expect(getByText('Hello')).toHaveAttribute('data-visible', 'true');
    expect(getByText('Hello')).toHaveClass('opacity-100', 'motion-reduce:opacity-100');
  });

  it('stays hidden until the element scrolls into view, then stops observing', () => {
    let trigger: ObserverCallback = () => undefined;
    const disconnect = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (this: unknown, callback: ObserverCallback) {
        trigger = callback;
        return { observe: vi.fn(), disconnect };
      })
    );
    const { getByText } = render(<Reveal delay={100}>Hello</Reveal>);
    const element = getByText('Hello');

    expect(element).toHaveAttribute('data-visible', 'false');
    expect(element).toHaveClass('opacity-0');
    expect(element).toHaveStyle({ transitionDelay: '100ms' });

    act(() => trigger([{ isIntersecting: false }]));
    expect(element).toHaveAttribute('data-visible', 'false');

    act(() => trigger([{ isIntersecting: true }]));
    expect(element).toHaveAttribute('data-visible', 'true');
    expect(disconnect).toHaveBeenCalled();
  });
});
