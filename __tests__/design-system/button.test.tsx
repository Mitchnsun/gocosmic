import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button, type ButtonProps } from '@/design-system/button';

describe('<Button />', () => {
  it('should render with default props', () => {
    render(<Button>Test Button</Button>);

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'cursor-pointer',
      'rounded-full',
      'transition-colors',
      'bg-neutral-950',
      'text-neutral-50',
      'hover:bg-neutral-800',
      'font-normal',
      'text-base',
      'px-6',
      'py-2'
    );
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Test Button</Button>);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
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
      'aerospace',
      'chocolate',
      'cosmic-latte',
      'ghost',
      'jungle',
      'misty-rose',
      'outer-space',
      'royal',
      'space',
    ];

    const variantClasses = {
      default: ['bg-neutral-950', 'text-neutral-50', 'hover:bg-neutral-800'],
      aerospace: ['bg-aerospace', 'text-neutral-50', 'hover:bg-aerospace/90'],
      chocolate: ['bg-chocolate', 'text-neutral-50', 'hover:bg-chocolate/90'],
      'cosmic-latte': ['bg-cosmic-latte', 'text-space', 'hover:bg-cosmic-latte/90', 'hover:text-space/90'],
      ghost: ['bg-ghost', 'text-neutral-900', 'hover:bg-violet-50'],
      jungle: ['bg-jungle', 'text-white', 'hover:bg-jungle/90'],
      'misty-rose': ['bg-misty-rose', 'text-space', 'hover:bg-misty-rose/80'],
      'outer-space': ['bg-outer-space', 'text-neutral-50', 'hover:bg-outer-space/90'],
      royal: ['bg-royal', 'text-neutral-50', 'hover:bg-royal/90'],
      space: ['bg-space', 'text-neutral-50', 'hover:bg-space/90'],
    };

    it.each(variants)('should apply correct classes for %s variant', (variant) => {
      render(<Button variant={variant}>Test Button</Button>);

      const expectedClasses = variantClasses[variant as keyof typeof variantClasses];

      expectedClasses.forEach((className: string) => {
        expect(screen.getByRole('button')).toHaveClass(className);
      });
    });
  });

  describe('sizes', () => {
    const sizes: Array<ButtonProps['size']> = ['default', 'sm', 'lg', 'icon'];

    const sizeClasses = {
      default: ['font-normal', 'text-base', 'px-6', 'py-2'],
      sm: ['font-light', 'text-sm', 'px-4', 'py-1'],
      lg: ['font-bold', 'text-lg', 'px-8', 'py-2'],
      icon: ['h-10', 'w-10'],
    };

    it.each(sizes)('should apply correct classes for %s size', (size) => {
      render(<Button size={size}>Test Button</Button>);

      const expectedClasses = sizeClasses[size as keyof typeof sizeClasses];

      expectedClasses.forEach((className: string) => {
        expect(screen.getByRole('button')).toHaveClass(className);
      });
    });
  });

  describe('asChild prop', () => {
    it('should render as Slot when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole('link');
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
      render(<Button asChild={false}>Regular Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('combination of props', () => {
    it('should apply multiple props correctly', () => {
      const handleClick = vi.fn();

      render(
        <Button variant="aerospace" size="lg" className="extra-class" onClick={handleClick} data-testid="combo-button">
          Combo Button
        </Button>
      );

      const button = screen.getByTestId('combo-button');
      expect(button).toHaveClass(
        'bg-aerospace',
        'text-neutral-50',
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
      render(<Button>Accessible Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should support aria attributes', () => {
      render(
        <Button aria-label="Close dialog" aria-describedby="dialog-desc">
          ×
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-describedby', 'dialog-desc');
    });
  });
});
