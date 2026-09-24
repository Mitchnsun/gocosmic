import { SectionHeading } from '@/components/SectionHeading';

import { render } from '../test-utils';

describe('SectionHeading', () => {
  it('renders the eyebrow, an h2 with its id, and the lead', () => {
    const { getByRole, getByText } = render(
      <SectionHeading
        eyebrow="[ Section · 02 ]"
        title={
          <>
            Title <em>with emphasis.</em>
          </>
        }
        titleId="section-title"
        lead="Supporting text"
      />
    );

    expect(getByText('[ Section · 02 ]')).toBeInTheDocument();
    expect(getByRole('heading', { level: 2, name: 'Title with emphasis.' })).toHaveAttribute('id', 'section-title');
    expect(getByText('Supporting text')).toBeInTheDocument();
  });

  it('renders an h1 for page intros and omits the lead when absent', () => {
    const { getByRole, container } = render(<SectionHeading eyebrow="Eyebrow" title="Page" titleId="page" level={1} />);

    expect(getByRole('heading', { level: 1, name: 'Page' })).toBeInTheDocument();
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });
});
