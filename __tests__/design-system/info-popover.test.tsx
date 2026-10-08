import { InfoPopover } from '@/design-system/info-popover';

import { fireEvent, render, waitFor } from '../test-utils';

const renderPopover = () =>
  render(
    <InfoPopover label="More about: Contact form" title="Contact form">
      <p>Messages land in your inbox.</p>
    </InfoPopover>
  );

describe('<InfoPopover />', () => {
  it('should render a closed, named trigger with a 44 px hit area', () => {
    const { getByRole, queryByRole } = renderPopover();

    const trigger = getByRole('button', { name: 'More about: Contact form' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveClass('size-11');
    expect(queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open a dialog named by its title on click', () => {
    const { getByRole } = renderPopover();

    fireEvent.click(getByRole('button', { name: 'More about: Contact form' }));

    const dialog = getByRole('dialog', { name: 'Contact form' });
    expect(dialog).toHaveTextContent('Messages land in your inbox.');
    expect(getByRole('button', { name: 'More about: Contact form' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('should close on Escape and give focus back to the trigger', async () => {
    const { getByRole, queryByRole } = renderPopover();
    const trigger = getByRole('button', { name: 'More about: Contact form' });

    fireEvent.click(trigger);
    fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });

    expect(queryByRole('dialog')).not.toBeInTheDocument();
    // Radix gives the focus back on the next tick.
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
