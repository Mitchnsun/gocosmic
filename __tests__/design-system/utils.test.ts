import { cn } from '@/design-system/lib/utils';

describe('cn utility function', () => {
  it('should return empty string when no arguments are provided', () => {
    expect(cn()).toBe('');
  });

  it('should handle single string argument', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  it('should handle multiple string arguments', () => {
    expect(cn('text-red-500', 'bg-blue-100')).toBe('text-red-500 bg-blue-100');
  });

  it('should handle undefined and null values', () => {
    expect(cn('text-red-500', undefined, null)).toBe('text-red-500');
  });

  it('should handle array of classes', () => {
    expect(cn(['text-red-500', 'bg-blue-100'])).toBe('text-red-500 bg-blue-100');
  });

  it('should handle object with boolean values', () => {
    expect(
      cn({
        'text-red-500': true,
        'bg-blue-100': false,
        'border-gray-300': true,
      })
    ).toBe('text-red-500 border-gray-300');
  });

  it('should merge conflicting Tailwind classes correctly', () => {
    // twMerge should handle conflicting classes by keeping the last one
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    expect(cn('p-4 p-6')).toBe('p-6');
    expect(cn('bg-red-500', 'bg-blue-600')).toBe('bg-blue-600');
    expect(cn('m-4', 'm-6')).toBe('m-6');
    expect(cn('p-4', 'p-8', 'pb-2')).toBe('p-8 pb-2');
  });

  it('should handle complex combinations', () => {
    const result = cn(
      'base-class',
      {
        'conditional-class': true,
        'false-class': false,
      },
      ['array-class-1', 'array-class-2'],
      undefined,
      'final-class'
    );
    expect(result).toBe('base-class conditional-class array-class-1 array-class-2 final-class');
  });

  it('should handle empty strings and whitespace', () => {
    expect(cn('', '  ', 'text-red-500')).toBe('text-red-500');
  });

  it('should work with real-world component scenarios', () => {
    // Simulate a component with base classes and conditional variants
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium';
    const variantClasses = 'bg-primary text-primary-foreground hover:bg-primary/90';
    const sizeClasses = 'h-10 px-4 py-2';
    const customClasses = 'custom-class';

    const result = cn(baseClasses, variantClasses, sizeClasses, customClasses);
    expect(result).toContain('inline-flex');
    expect(result).toContain('items-center');
    expect(result).toContain('bg-primary');
    expect(result).toContain('custom-class');
  });

  it('should preserve non-conflicting classes when merging', () => {
    expect(cn('text-center', 'text-red-500', 'bg-blue-100')).toBe('text-center text-red-500 bg-blue-100');
  });
});
