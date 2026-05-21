import NotFound from '@/app/[locale]/not-found';

import { render } from '../test-utils';

describe('NotFound (Locale)', () => {
  it('should render 404 page', () => {
    const { getByRole, getByText } = render(<NotFound />);

    const heading = getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('You seem to be lost in space');

    const description = getByText("Maybe the stars just haven't aligned yet.");
    expect(description.tagName).toBe('P');
    expect(description).toHaveClass('my-8', 'text-center');

    const homeLink = getByRole('link', { name: 'Go back home' });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
