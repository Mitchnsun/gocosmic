import Home from '@/app/[locale]/page';

import { render } from '../test-utils';

describe('Home Page', () => {
  it('should render the home page correctly', () => {
    const { container } = render(<Home />);

    expect(container).toMatchSnapshot();
  });
});
