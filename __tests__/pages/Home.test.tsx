import Home from '@/app/[locale]/page';

import { render } from '../test-utils';

describe('Home Page', () => {
  it('should render the home page correctly', () => {
    const { container, getByText } = render(<Home />);

    expect(getByText(/available in annecy, geneva, and haute-savoie/i)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
