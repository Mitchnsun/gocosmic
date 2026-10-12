import { act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import { THEME_STORAGE_KEY, ThemeProvider, ThemeToggle } from '@/components/Theme';

import common from '../../../messages/en/common.json';
import { render, screen } from '../../test-utils';

const renderToggle = () =>
  render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>
  );

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('starts in the dark theme and offers the light one', () => {
    renderToggle();
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('button', { name: 'Switch to the light theme' })).toBeInTheDocument();
  });

  it('switches to light, remembers the choice and offers dark back', () => {
    renderToggle();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to the light theme' }));

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(screen.getByRole('button', { name: 'Switch to the dark theme' })).toBeInTheDocument();
  });

  it('restores a stored light choice on the next visit', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    renderToggle();
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    expect(screen.getByRole('button', { name: 'Switch to the dark theme' })).toBeInTheDocument();
  });

  it('works from the keyboard', async () => {
    const user = userEvent.setup();
    renderToggle();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Switch to the light theme' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
    await user.keyboard(' ');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
  });

  it('is a 44 px switch with a comet and a sun, the thumb moved by the light: variant', () => {
    renderToggle();
    const button = screen.getByRole('button', { name: 'Switch to the light theme' });
    expect(button).toHaveClass('h-11', 'rounded-full');
    const [comet, sun] = button.querySelectorAll('svg');
    expect(comet).toHaveClass('text-fg', 'light:text-fg-3');
    expect(sun).toHaveClass('text-fg-3', 'light:text-fg');
    expect(button.querySelector('span')).toHaveClass('light:translate-x-9');
  });

  it('renders the dark-theme label on the server, whatever was stored', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={common}>
        <ThemeProvider>
          <ThemeToggle />
        </ThemeProvider>
      </NextIntlClientProvider>
    );
    expect(html).toContain('aria-label="Switch to the light theme"');
  });

  it('keeps the browser chrome colour on the page background', () => {
    renderToggle();
    const meta = () => document.head.querySelector('meta[name="theme-color"]');
    expect(meta()).toHaveAttribute('content', '#020617');
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Switch to the light theme' }));
    });
    expect(meta()).toHaveAttribute('content', '#fff8e7');
  });

  describe('switch animation', () => {
    const originalMatchMedia = window.matchMedia;
    const mockReducedMotion = (reduce: boolean) => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: reduce && query.includes('reduce'),
        media: query,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }));
    };

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
      vi.useRealTimers();
      document.documentElement.classList.remove('theme-fade', 'theme-rise');
    });

    it('cross-fades the colours and raises the sun on the way to light, then cleans up', () => {
      vi.useFakeTimers();
      mockReducedMotion(false);
      renderToggle();
      const root = document.documentElement;

      fireEvent.click(screen.getByRole('button', { name: 'Switch to the light theme' }));
      expect(root).toHaveClass('theme-fade', 'theme-rise');

      act(() => {
        vi.advanceTimersByTime(350);
      });
      expect(root).not.toHaveClass('theme-fade');
      expect(root).toHaveClass('theme-rise');
      act(() => {
        vi.advanceTimersByTime(650);
      });
      expect(root).not.toHaveClass('theme-rise');

      fireEvent.click(screen.getByRole('button', { name: 'Switch to the dark theme' }));
      expect(root).toHaveClass('theme-fade');
      expect(root).not.toHaveClass('theme-rise');
    });

    it('switches instantly when the visitor prefers reduced motion', () => {
      mockReducedMotion(true);
      renderToggle();

      fireEvent.click(screen.getByRole('button', { name: 'Switch to the light theme' }));
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      expect(document.documentElement).not.toHaveClass('theme-fade');
      expect(document.documentElement).not.toHaveClass('theme-rise');
    });
  });
});
