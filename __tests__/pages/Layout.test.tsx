import Layout, { viewport } from '@/app/layout';

import { render } from '../test-utils';

describe('Layout', () => {
  it('should return children', () => {
    const { getByText } = render(
      <Layout>
        <div>Child</div>
      </Layout>
    );
    expect(getByText('Child')).toBeInTheDocument();
  });

  it('should have correct viewport configuration', () => {
    expect(viewport).toEqual({
      width: 'device-width',
      initialScale: 1,
    });
  });
});
