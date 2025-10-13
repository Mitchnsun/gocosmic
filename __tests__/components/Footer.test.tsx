import { Footer } from '@/components/Footer';
import { render, screen } from '../test-utils';

describe('Footer Component', () => {
  it('should render the footer correctly', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByText(/© 2025 Go Cosmic. All rights reserved./i)).toBeInTheDocument();
  });
});
