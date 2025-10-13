import { Loader } from '@/components/Loader';

import { render } from '../test-utils';

describe('Loader Component', () => {
  it('should render the loader with spinner animation', () => {
    const { container } = render(<Loader />);

    const loader = container.firstChild as HTMLElement;
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');

    const spinner = loader.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(
      'mx-auto',
      'mb-4',
      'h-8',
      'w-8',
      'animate-spin',
      'rounded-full',
      'border-4',
      'border-gray-600',
      'border-t-white'
    );

    expect(container).toHaveTextContent('Loading your Cosmic journey...');
  });

  it('should apply custom className', () => {
    const { container } = render(<Loader className="custom-class" />);

    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveClass('custom-class');
  });

  it('should set fullScreen height when fullScreen prop is true', () => {
    const { container } = render(<Loader fullScreen />);

    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveStyle({
      minHeight: 'calc(100vh - var(--header-footer-height))',
    });
  });

  it('should not set fullScreen height when fullScreen prop is false', () => {
    const { container } = render(<Loader fullScreen={false} />);

    const loader = container.firstChild as HTMLElement;
    expect(loader).toHaveStyle({
      minHeight: 'none',
    });
  });
});
