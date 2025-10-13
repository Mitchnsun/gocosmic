import type { AnchorHTMLAttributes, ReactNode } from 'react';
import React from 'react';
import { vi } from 'vitest';

import Home from '@/app/[locale]/page';

import { render } from '../test-utils';

type MockLinkProps = { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>;

vi.mock('@/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: MockLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('Home Page', () => {
  it('should render the home page correctly', () => {
    const { container } = render(<Home />);

    expect(container).toMatchSnapshot();
  });
});
