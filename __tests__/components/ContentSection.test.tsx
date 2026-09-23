import { describe, expect, it } from 'vitest';

import { ContentSection } from '@/components/ContentSection';

import { render } from '../test-utils';

describe('ContentSection', () => {
  it('links the section to its heading', () => {
    const { getByRole } = render(<ContentSection id="mission" title="Our mission" />);

    const section = getByRole('region', { name: 'Our mission' });
    expect(section).toHaveAttribute('aria-labelledby', 'mission-heading');
    expect(getByRole('heading', { level: 2, name: 'Our mission' })).toHaveAttribute('id', 'mission-heading');
  });

  it('renders the eyebrow, counter, lead and children', () => {
    const { getByText } = render(
      <ContentSection id="mission" eyebrow="Mission" index="01 / 03" title="Our mission" lead="A short lead">
        <p>Body content</p>
      </ContentSection>
    );

    expect(getByText('Mission')).toBeInTheDocument();
    expect(getByText('01 / 03')).toBeInTheDocument();
    expect(getByText('A short lead')).toBeInTheDocument();
    expect(getByText('Body content')).toBeInTheDocument();
  });

  it('drops the card surface in flat mode', () => {
    const { container } = render(<ContentSection id="flat" title="Flat" flat />);

    expect(container.querySelector('.rounded-2xl')).toBeNull();
  });
});
