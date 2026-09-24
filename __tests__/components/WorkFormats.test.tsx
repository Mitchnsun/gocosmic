import { WorkFormats } from '@/components/WorkFormats';

import { render } from '../test-utils';

describe('WorkFormats', () => {
  it('lists the formats with their price line and a link to the contact page', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <WorkFormats
        eyebrow="[ For companies ]"
        title="Extra hands"
        lead="For teams"
        ctaText="Let's talk"
        formats={[
          { title: 'Day-rate mission', price: '600€ excl. VAT / day', description: 'Joins your team' },
          { title: 'Full team', price: 'Quoted', description: 'For bigger projects' },
        ]}
      />
    );

    expect(getByRole('region', { name: 'Extra hands' })).toBeInTheDocument();
    expect(getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(getByText('600€ excl. VAT / day')).toBeInTheDocument();
    expect(getByRole('link', { name: "Let's talk" })).toHaveAttribute('href', '/contact');
  });
});
