import { FreeMockupPitch } from '@/components/FreeMockup';

import { render } from '../../test-utils';

describe('FreeMockupPitch', () => {
  it('renders the page heading and intro', () => {
    const { getByRole, getByText } = render(<FreeMockupPitch />);

    expect(getByRole('heading', { level: 1, name: 'See your site before you decide' })).toBeInTheDocument();
    expect(getByText(/Tell us where you stand today/)).toBeInTheDocument();
  });

  it('lists the three steps in order', () => {
    const { getAllByRole } = render(<FreeMockupPitch />);

    const steps = getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveTextContent('You send the essentials');
    expect(steps[1]).toHaveTextContent('We design a mockup');
    expect(steps[2]).toHaveTextContent('You decide, calmly');
  });

  it('labels the steps section with its heading', () => {
    const { getByRole } = render(<FreeMockupPitch />);

    expect(getByRole('region', { name: 'How it works' })).toBeInTheDocument();
  });

  it('links the privacy notice to the privacy policy', () => {
    const { getByRole, getByText } = render(<FreeMockupPitch />);

    expect(getByText(/only to prepare and send your mockup/)).toBeInTheDocument();
    expect(getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
  });
});
