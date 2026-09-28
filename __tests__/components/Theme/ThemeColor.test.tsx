import { render } from '@testing-library/react';

import { THEME_STORAGE_KEY, ThemeColorBoot, ThemeProvider } from '@/components/Theme';
import { bootThemeColor, THEME_COLOR_BOOT_ATTRIBUTE, THEME_COLOR_BOOT_SCRIPT } from '@/components/Theme/Theme.boot';

const bootMetas = () => document.head.querySelectorAll(`meta[${THEME_COLOR_BOOT_ATTRIBUTE}]`);

describe('theme-color before hydration', () => {
  afterEach(() => {
    localStorage.clear();
    // Only the tags created here; React removes its own on unmount.
    document.head
      .querySelectorAll(`meta[data-test-meta], meta[${THEME_COLOR_BOOT_ATTRIBUTE}]`)
      .forEach((meta) => meta.remove());
  });

  it('puts a cream theme-color first in <head> for a visitor who chose the light theme', () => {
    const existing = document.createElement('meta');
    existing.name = 'theme-color';
    existing.content = '#020617';
    existing.dataset.testMeta = '';
    document.head.append(existing);
    localStorage.setItem(THEME_STORAGE_KEY, 'light');

    bootThemeColor(THEME_STORAGE_KEY, '#fff8e7', THEME_COLOR_BOOT_ATTRIBUTE);

    const first = document.head.querySelector('meta[name="theme-color"]');
    expect(first).toHaveAttribute('content', '#fff8e7');
    expect(first).toHaveAttribute(THEME_COLOR_BOOT_ATTRIBUTE);
    expect(existing).toHaveAttribute('content', '#020617');
  });

  it('leaves the dark default alone otherwise', () => {
    bootThemeColor(THEME_STORAGE_KEY, '#fff8e7', THEME_COLOR_BOOT_ATTRIBUTE);
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    bootThemeColor(THEME_STORAGE_KEY, '#fff8e7', THEME_COLOR_BOOT_ATTRIBUTE);

    expect(bootMetas()).toHaveLength(0);
  });

  it('serialises the boot into a self-contained inline script', () => {
    const { container } = render(<ThemeColorBoot />);
    const script = container.querySelector('script');

    expect(script?.innerHTML).toBe(THEME_COLOR_BOOT_SCRIPT);
    expect(THEME_COLOR_BOOT_SCRIPT).toContain(`"${THEME_STORAGE_KEY}"`);
    expect(THEME_COLOR_BOOT_SCRIPT).toContain('"#fff8e7"');
  });

  it('drops the stand-in once the rendered tag carries the light theme', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    bootThemeColor(THEME_STORAGE_KEY, '#fff8e7', THEME_COLOR_BOOT_ATTRIBUTE);
    expect(bootMetas()).toHaveLength(1);

    render(<ThemeProvider>{null}</ThemeProvider>);

    expect(bootMetas()).toHaveLength(0);
    const metas = document.head.querySelectorAll('meta[name="theme-color"]');
    expect(metas).toHaveLength(1);
    expect(metas[0]).toHaveAttribute('content', '#fff8e7');
  });
});
