import MComperat from '@/app/[locale]/projects/mcomperat/page';

import { render } from '../test-utils';

describe('MComperat Page', () => {
  it('should render the mcomperat page correctly', () => {
    const { container } = render(<MComperat />);

    expect(container).toMatchSnapshot();
  });
});
