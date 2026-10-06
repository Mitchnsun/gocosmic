import { render, screen, within } from '@testing-library/react';

import { DesignSystemShowcase, type ShowcaseLabels } from '@/components/DesignSystemShowcase';

import messages from '../../../messages/en/design-system.json';

const copy = messages['design-system'];
const labels: ShowcaseLabels = {
  tokens: copy.tokens,
  buttons: copy.buttons,
  tags: copy.tags,
  fields: copy.fields,
  grid: copy.grid,
  sample: copy.sample,
};

const renderBoth = () =>
  render(
    <>
      <DesignSystemShowcase theme="dark" title={copy.dark} labels={labels} />
      <DesignSystemShowcase theme="light" title={copy.light} labels={labels} />
    </>
  );

describe('DesignSystemShowcase', () => {
  it('renders each panel as a theme island', () => {
    renderBoth();
    expect(screen.getByRole('region', { name: copy.dark })).toHaveAttribute('data-theme', 'dark');
    expect(screen.getByRole('region', { name: copy.light })).toHaveAttribute('data-theme', 'light');
  });

  it('shows every primitive in a panel: tokens, buttons, chips, fields, slider and grid', () => {
    renderBoth();
    const panel = within(screen.getByRole('region', { name: copy.light }));

    expect(panel.getByText('aerospace-ink')).toBeInTheDocument();
    expect(panel.getByRole('button', { name: copy.sample.primary })).toBeInTheDocument();
    expect(panel.getByRole('button', { name: copy.sample.secondary })).toBeInTheDocument();
    expect(panel.getByText(copy.sample.chip_ok)).toHaveClass('text-ok');
    expect(panel.getByRole('checkbox', { name: copy.sample.checkbox })).toBeChecked();
    expect(panel.getByRole('slider')).toBeInTheDocument();
    expect(panel.getByText(`${copy.sample.cell} 3`)).toBeInTheDocument();
  });

  it('keeps field ids unique across the two panels and wires the error message', () => {
    renderBoth();
    const emails = screen.getAllByRole('textbox', { name: /Email address/ });
    expect(emails.map((input) => input.id)).toEqual(['dark-email', 'light-email']);
    expect(emails[1]).toHaveAccessibleDescription(copy.sample.email_error);
  });
});
