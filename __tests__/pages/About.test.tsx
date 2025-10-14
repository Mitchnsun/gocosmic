import About from '@/app/[locale]/about/page';

import { render } from '../test-utils';

describe('About Page', () => {
  it('should render the about page correctly', () => {
    const { container } = render(<About />);

    expect(container).toMatchSnapshot();
  });
});
