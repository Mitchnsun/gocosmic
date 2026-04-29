import { Footer } from '@/components/Footer';

import { render, screen } from '../test-utils';

describe('Footer Component', () => {
  it('should render the footer correctly', () => {
    const year = new Date().getFullYear();

    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(`© ${year} Go Cosmic. All rights reserved.`)).toBeInTheDocument();
  });
});
