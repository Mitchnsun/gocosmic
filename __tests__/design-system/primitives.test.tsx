import { Chip } from '@/design-system/chip';
import { Eyebrow } from '@/design-system/eyebrow';
import { HairlineGrid } from '@/design-system/hairline-grid';

import { render } from '../test-utils';

describe('Eyebrow', () => {
  it('renders the label after a decorative signal dot', () => {
    const { getByText, container } = render(<Eyebrow className="extra">[ Pour qui ]</Eyebrow>);

    expect(getByText('[ Pour qui ]')).toHaveClass('font-mono', 'text-aerospace', 'extra');
    expect(container.querySelector('[aria-hidden="true"]')).toHaveClass('bg-aerospace', 'rounded-full');
  });
});

describe('Chip', () => {
  it('renders a neutral tag by default', () => {
    const { getByText } = render(<Chip>Multilingual</Chip>);

    expect(getByText('Multilingual')).toHaveClass('border-line-2', 'text-fg-2', 'font-mono');
  });

  it('switches to green for what is included', () => {
    const { getByText } = render(<Chip variant="jungle">Free</Chip>);

    expect(getByText('Free')).toHaveClass('border-ok/50', 'text-ok');
  });
});

describe('HairlineGrid', () => {
  it('renders a list with 1 px gaps and the given columns', () => {
    const { getByRole } = render(
      <HairlineGrid className="md:grid-cols-3">
        <li>One</li>
      </HairlineGrid>
    );

    expect(getByRole('list')).toHaveClass('grid', 'gap-px', 'md:grid-cols-3');
    expect(getByRole('list').tagName).toBe('UL');
  });

  it('can render an ordered list', () => {
    const { getByRole } = render(
      <HairlineGrid as="ol">
        <li>First</li>
      </HairlineGrid>
    );

    expect(getByRole('list').tagName).toBe('OL');
  });
});
