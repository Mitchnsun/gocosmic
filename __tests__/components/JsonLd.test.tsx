import { render } from '@testing-library/react';

import { JsonLd } from '@/components/JsonLd/JsonLd';

describe('JsonLd', () => {
  it('renders the data as a JSON-LD script, escaping what could close the element', () => {
    const data = { '@type': 'Thing', name: 'A </script><b>name</b>', skipped: undefined };
    const { container } = render(<JsonLd scriptKey="thing-json-ld" data={data} />);
    const script = container.querySelector('script#thing-json-ld');

    expect(script).toHaveAttribute('type', 'application/ld+json');
    expect(script?.innerHTML).not.toContain('<');
    expect(JSON.parse(script?.innerHTML ?? '')).toEqual({ '@type': 'Thing', name: 'A </script><b>name</b>' });
  });
});
