import ChoeurDesPaysduMontBlanc from '@/app/[locale]/projects/choeurdespaysdumontblanc/page';

import { render } from '../test-utils';

describe('ChoeurDesPaysduMontBlanc Page', () => {
  it('should render the choeur des pays du mont blanc page correctly', () => {
    const { container } = render(<ChoeurDesPaysduMontBlanc />);

    expect(container).toMatchSnapshot();
  });
});
