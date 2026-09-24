import NotFound from '@/app/[locale]/not-found';

import { render } from '../test-utils';

describe('NotFound (Locale)', () => {
  it('uses the one space metaphor and offers a way home and a way to ask', () => {
    const { getByRole, getByText } = render(<NotFound />);

    expect(getByRole('heading', { level: 1 })).toHaveTextContent('This page has drifted out of orbit.');
    expect(getByText('[ Error 404 ]')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Back to the homepage' })).toHaveAttribute('href', '/');
    expect(getByRole('link', { name: 'Tell us what you were looking for' })).toHaveAttribute('href', '/contact');
  });
});
