import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/tabs';

import { act, fireEvent, render, waitFor } from '../test-utils';

const renderTabs = () =>
  render(
    <Tabs defaultValue="one">
      <TabsList aria-label="Plans">
        <TabsTrigger value="one">First</TabsTrigger>
        <TabsTrigger value="two">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="one">First panel</TabsContent>
      <TabsContent value="two">Second panel</TabsContent>
    </Tabs>
  );

describe('<Tabs />', () => {
  it('should render a named tab list with the default tab selected', () => {
    const { getByRole, getByText, queryByText } = renderTabs();

    expect(getByRole('tablist', { name: 'Plans' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'true');
    expect(getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'false');
    expect(getByRole('tabpanel')).toHaveTextContent('First panel');
    expect(getByText('First panel')).toBeInTheDocument();
    expect(queryByText('Second panel')).not.toBeInTheDocument();
  });

  it('should switch panels when a tab is pressed', () => {
    const { getByRole } = renderTabs();

    fireEvent.mouseDown(getByRole('tab', { name: 'Second' }));

    expect(getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
    expect(getByRole('tabpanel')).toHaveTextContent('Second panel');
  });

  it('should move to the next tab with the arrow keys', async () => {
    const { getByRole } = renderTabs();
    const first = getByRole('tab', { name: 'First' });

    act(() => first.focus());
    fireEvent.keyDown(first, { key: 'ArrowRight' });

    // Radix moves the focus on the next tick.
    await waitFor(() => expect(getByRole('tab', { name: 'Second' })).toHaveFocus());
    expect(getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true');
  });

  it('should give the active tab the filled style and the panel a focus ring', () => {
    const { getByRole } = renderTabs();

    expect(getByRole('tab', { name: 'First' })).toHaveClass('data-[state=active]:bg-fg', 'min-h-11');
    expect(getByRole('tabpanel')).toHaveClass('focus-visible:ring-2');
  });
});
