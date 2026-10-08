import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { DesignSystemShowcase } from '@/components/DesignSystemShowcase';
import { IMMERSIVE, SAMPLE, SECTIONS, THEME_LABELS } from '@/components/DesignSystemShowcase/DesignSystemShowcase.copy';
import { describeType } from '@/components/DesignSystemShowcase/DesignSystemShowcase.hooks';
import { DESIGN_TOKENS } from '@/design-system/tokens';

// jsdom has no canvas: the starfield is replaced by a marker.
vi.mock('@/components/Starfield', () => ({ default: () => <div data-testid="starfield" /> }));

/** Panel of a section in one theme, e.g. `Colors · Light · star`. */
const panel = (title: string, theme: 'dark' | 'light') =>
  within(
    screen.getByRole('group', { name: `${title} · ${theme === 'dark' ? THEME_LABELS.dark : THEME_LABELS.light}` })
  );

describe('DesignSystemShowcase', () => {
  it('shows every section in both themes side by side by default', () => {
    render(<DesignSystemShowcase />);

    expect(screen.getByRole('button', { name: 'Side by side' })).toHaveAttribute('aria-pressed', 'true');
    for (const { title } of SECTIONS) {
      expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
      expect(screen.getByRole('group', { name: `${title} · ${THEME_LABELS.dark}` })).toHaveAttribute(
        'data-theme',
        'dark'
      );
      expect(screen.getByRole('group', { name: `${title} · ${THEME_LABELS.light}` })).toHaveAttribute(
        'data-theme',
        'light'
      );
    }
  });

  it('switches to a single theme from the toolbar', () => {
    render(<DesignSystemShowcase />);

    fireEvent.click(screen.getByRole('button', { name: 'Light' }));
    expect(screen.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByRole('group', { name: `Colors · ${THEME_LABELS.dark}` })).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: `Colors · ${THEME_LABELS.light}` })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Dark' }));
    expect(screen.queryByRole('group', { name: `Colors · ${THEME_LABELS.light}` })).not.toBeInTheDocument();
    expect(screen.getByRole('group', { name: `Colors · ${THEME_LABELS.dark}` })).toBeInTheDocument();
  });

  it('links each section from the table of contents', () => {
    render(<DesignSystemShowcase />);
    const toc = within(screen.getByRole('navigation', { name: 'Design system sections' }));

    SECTIONS.forEach(({ id, title }, index) => {
      const link = toc.getByRole('link', { name: `${String(index + 1).padStart(2, '0')} · ${title}` });
      expect(link).toHaveAttribute('href', `#${id}`);
      expect(document.getElementById(id)).toBeInTheDocument();
    });
  });

  it('lists every token with its value and an AA ratio for each text token', () => {
    render(<DesignSystemShowcase />);

    for (const theme of ['dark', 'light'] as const) {
      const colors = panel('Colors', theme);
      for (const { name } of DESIGN_TOKENS) expect(colors.getByText(name)).toBeInTheDocument();
      expect(colors.getAllByText(/:1 · AA$/)).toHaveLength(DESIGN_TOKENS.filter((token) => token.readOn).length);
      expect(colors.queryByText(/Fail$/)).not.toBeInTheDocument();
    }
    expect(panel('Colors', 'light').getByText('#b83a00')).toBeInTheDocument();
    expect(panel('Colors', 'light').getByText('rgb(2 6 23 / 0.6) → #67676a')).toBeInTheDocument();
  });

  it('shows the five text styles with their computed values', () => {
    render(<DesignSystemShowcase />);
    const typography = panel('Typography', 'dark');

    for (const label of ['H1', 'H2', 'H3', 'Body', 'Eyebrow']) expect(typography.getByText(label)).toBeInTheDocument();
    expect(typography.getAllByText(/^computed: (?!…)/)).toHaveLength(5);
    expect(typography.getByRole('heading', { level: 1 })).toHaveAttribute('id', 'dark-type-h1');
  });

  it('renders the real components in each theme', () => {
    render(<DesignSystemShowcase />);
    const components = panel('Components', 'light');

    expect(components.getByRole('button', { name: SAMPLE.primary })).toBeInTheDocument();
    expect(components.getByText(SAMPLE.chipOk)).toHaveClass('text-ok');
    expect(components.getByText(SAMPLE.available)).toBeInTheDocument();
    expect(components.getByRole('checkbox', { name: SAMPLE.checkbox })).toBeChecked();
    expect(components.getByRole('slider')).toBeInTheDocument();
    expect(components.getByLabelText(SAMPLE.emailLabel, { exact: false })).toHaveAttribute('aria-invalid', 'true');
    expect(components.getByRole('tab', { name: SAMPLE.tabManaged })).toHaveAttribute('aria-selected', 'true');
    expect(components.getByRole('tabpanel')).toHaveTextContent(SAMPLE.panelManaged);
    expect(components.getByRole('button', { name: `More about: ${SAMPLE.infoOption}` })).toBeInTheDocument();
  });

  it('adapts the immersive rule and the illustration to each theme', () => {
    render(<DesignSystemShowcase />);

    expect(panel('Voice & cosmic universe', 'dark').getByText(IMMERSIVE.dark)).toBeInTheDocument();
    expect(panel('Voice & cosmic universe', 'light').getByText(IMMERSIVE.light)).toBeInTheDocument();
    expect(panel('Illustrations', 'dark').getByTestId('starfield')).toBeInTheDocument();
    expect(panel('Illustrations', 'light').queryByTestId('starfield')).not.toBeInTheDocument();
  });

  it('renders each theme exception with its reason', () => {
    render(<DesignSystemShowcase />);
    const exceptions = panel('Theme exceptions', 'light');

    expect(exceptions.getByRole('heading', { name: 'Orange button' })).toBeInTheDocument();
    expect(exceptions.getByText('calendar.google.com').parentElement).toHaveAttribute('data-theme', 'light');
    expect(exceptions.getAllByRole('img')).toHaveLength(2);
    expect(exceptions.getByText('data-theme="dark"')).toHaveAttribute('data-theme', 'dark');
  });
});

describe('describeType', () => {
  it('summarises a computed style', () => {
    const style = {
      fontFamily: '"Space Grotesk", system-ui',
      fontWeight: '600',
      fontSize: '56px',
      lineHeight: '56px',
      letterSpacing: '-1.68px',
    } as CSSStyleDeclaration;

    expect(describeType(style)).toBe('Space Grotesk 600 · 56px / 56px · -1.68px');
    expect(describeType({ ...style, fontFamily: '' } as CSSStyleDeclaration)).toMatch(/^inherit 600/);
  });
});
