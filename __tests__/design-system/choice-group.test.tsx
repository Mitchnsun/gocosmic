import { ChoiceGroup } from '@/design-system/choice-group';

import { fireEvent, render, screen } from '../test-utils';

const choices = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
] as const;

describe('ChoiceGroup', () => {
  it('names the group by its legend and describes it by its help', () => {
    render(
      <ChoiceGroup
        legend="Do you have one?"
        help="For example a domain name."
        type="radio"
        choices={choices}
        selected={['no']}
        onChange={() => {}}
      />
    );

    const group = screen.getByRole('group', { name: 'Do you have one?' });
    expect(group).toHaveAccessibleDescription('For example a domain name.');
    expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Yes' })).not.toBeChecked();
  });

  it('reports a radio answer, even one picked again', () => {
    const onChange = vi.fn();
    render(
      <ChoiceGroup legend="Do you have one?" type="radio" choices={choices} selected={['no']} onChange={onChange} />
    );

    fireEvent.click(screen.getByRole('radio', { name: 'Yes' }));
    fireEvent.click(screen.getByRole('radio', { name: 'No' }));

    expect(onChange.mock.calls).toEqual([['yes'], ['no']]);
  });

  it('offers several answers as check boxes', () => {
    const onChange = vi.fn();
    render(
      <ChoiceGroup
        legend="How do they reach you?"
        type="checkbox"
        choices={choices}
        selected={['yes', 'no']}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Yes' }));

    expect(screen.getAllByRole('checkbox', { checked: true })).toHaveLength(2);
    expect(onChange).toHaveBeenCalledExactlyOnceWith('yes');
  });
});
