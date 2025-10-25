import DailyFortune from '@/app/[locale]/applications/daily-fortune/page';

import { render } from '../test-utils';

describe('DailyFortune Page', () => {
  it('should render the daily fortune page correctly', () => {
    const { container } = render(<DailyFortune />);

    expect(container).toMatchSnapshot();
  });
});
