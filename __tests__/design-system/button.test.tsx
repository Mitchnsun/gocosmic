import { userEvent } from '@testing-library/user-event';

import { Button, type ButtonProps } from '@/design-system/button';

import { render } from '../test-utils';

describe('<Button />', () => {
  it('should render with default props', () => {
    const { getByRole } = render(<Button>Test Button</Button>);

    const button = getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'rounded-full',
      'transition-colors',
      'bg-line',
      'text-fg',
      'hover:bg-line-2',
      'font-normal',
      'text-base',
      'px-6',
      'py-2'
    );
  });

  it('should apply custom className', () => {
    const { getByRole } = render(<Button className="custom-class">Test Button</Button>);

    expect(getByRole('button')).toHaveClass('custom-class');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    const { getByRole } = render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>);

    const button = getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();

    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  describe('variants', () => {
    const variants: Array<ButtonProps['variant']> = [
      'default',
      'primary',
      'ghost',
      'link',
      'aerospace',
      'royal',
      'jungle',
    ];

    const variantClasses = {
      default: ['bg-line', 'text-fg', 'hover:bg-line-2'],
      primary: ['bg-aerospace', 'text-void', 'shadow-[0_0_32px_rgb(255_79_0/0.4)]'],
      ghost: ['border', 'border-line-2', 'bg-transparent', 'text-fg'],
      link: ['text-aerospace', 'hover:underline'],
      aerospace: ['bg-aerospace', 'text-void', 'hover:bg-aerospace/90'],
      royal: ['bg-royal', 'text-ghost', 'hover:bg-royal/90'],
      jungle: ['bg-ok', 'text-void', 'hover:bg-ok/90'],
    };

    it.each(variants)('should apply correct classes for %s variant', (variant) => {
      const { getByRole } = render(<Button variant={variant}>Test Button</Button>);

      const expectedClasses = variantClasses[variant as keyof typeof variantClasses];

      expectedClasses.forEach((className: string) => {
        expect(getByRole('button')).toHaveClass(className);
      });
    });
  });

  describe('sizes', () => {
    const sizes: Array<ButtonProps['size']> = ['default', 'sm', 'lg', 'icon', 'pill', 'inline'];

    const sizeClasses = {
      default: ['font-normal', 'text-base', 'px-6', 'py-2'],
      sm: ['font-light', 'text-sm', 'px-4', 'py-1'],
      lg: ['font-bold', 'text-lg', 'px-8', 'py-2'],
      icon: ['h-10', 'w-10'],
      pill: ['h-12', 'px-6', 'font-semibold'],
      inline: ['p-0', 'font-semibold'],
    };

    it.each(sizes)('should apply correct classes for %s size', (size) => {
      const { getByRole } = render(<Button size={size}>Test Button</Button>);

      const expectedClasses = sizeClasses[size as keyof typeof sizeClasses];

      expectedClasses.forEach((className: string) => {
        expect(getByRole('button')).toHaveClass(className);
      });
    });
  });

  describe('asChild prop', () => {
    it('should render as Slot when asChild is true', () => {
      const { getByRole } = render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
      expect(link).toHaveClass(
        'inline-flex',
        'items-center',
        'justify-center',
        'cursor-pointer',
        'rounded-full',
        'transition-colors'
      );
    });

    it('should render as button when asChild is false', () => {
      const { getByRole } = render(<Button asChild={false}>Regular Button</Button>);

      const button = getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('combination of props', () => {
    it('should apply multiple props correctly', () => {
      const handleClick = vi.fn();

      const { getByTestId } = render(
        <Button variant="aerospace" size="lg" className="extra-class" onClick={handleClick} data-testid="combo-button">
          Combo Button
        </Button>
      );

      const button = getByTestId('combo-button');
      expect(button).toHaveClass(
        'bg-aerospace',
        'text-void',
        'hover:bg-aerospace/90',
        'font-bold',
        'text-lg',
        'px-8',
        'py-2',
        'extra-class'
      );
    });
  });

  describe('accessibility', () => {
    it('should have correct button role', () => {
      const { getByRole } = render(<Button>Accessible Button</Button>);

      const button = getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should support aria attributes', () => {
      const { getByRole } = render(
        <Button aria-label="Close dialog" aria-describedby="dialog-desc">
          ×
        </Button>
      );

      const button = getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-describedby', 'dialog-desc');
    });
  });
});
