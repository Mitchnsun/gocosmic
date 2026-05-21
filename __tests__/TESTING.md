# Testing Documentation for Web App

This document describes the testing patterns and configuration implemented for the Go Cosmic web application.

## Overview

The web app now includes a comprehensive test suite using:

- **Vitest 3.2.4** - Fast unit testing framework
- **React Testing Library 16.1.0** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - User interaction testing
- **jsdom** - DOM simulation for testing

## Configuration

### Test Configuration (`vitest.config.ts`)

- **Environment**: jsdom for DOM testing
- **Setup**: Automatic cleanup after each test
- **Coverage**: 90% minimum threshold (currently achieving 100%)
- **Path Mapping**: Supports `@/` alias for imports
- **Excludes**: Configuration files, build artifacts, and test files themselves

### TypeScript Configuration

- **`tsconfig.json`**: Build configuration (excludes tests)
- **`tsconfig.check.json`**: Type checking configuration (includes tests)

## Test Structure

Follow the same folder structure as the project:

```
__tests__/
├── components/          # Component tests
├── i18n/               # i18n utility tests (canonical URLs)
├── pages/              # Page tests
├── views/              # View component tests
├── proxy.test.ts       # Middleware/proxy tests
├── test-setup.tsx      # Global test configuration
├── test-utils.tsx      # Custom render with NextIntlClientProvider
└── tsconfig.json       # TypeScript configuration for tests
```

## Testing Patterns

### Component and Page Testing

- Test component/page rendering and behavior
- Verify proper semantic HTML structure
- Check accessibility attributes (ARIA, roles)
- Validate CSS classes and styling
- Test user interactions where applicable

Example:

```typescript
import { render } from '../test-utils';
import { Header } from '@/components/Header';

describe('Header Component', () => {
  it('should render the "Go Cosmic" title', () => {
    const { getByRole } = render(<Header />);

    const title = getByRole('heading', { name: /go cosmic/i });
    expect(title).toBeInTheDocument();
  });
});
```

### Query Methods

Destructure `get*` and `query*` helpers directly from the return value of `render()` rather than importing and using `screen`:

```typescript
// ✅ preferred
const { getByRole, queryByText } = render(<MyComponent />);

// ❌ avoid
import { screen } from '@testing-library/react';
render(<MyComponent />);
screen.getByRole(...);
```

This keeps each test self-contained and avoids implicit global state.

### Imports — always use `test-utils`

Always import `render` and `fireEvent` (and other Testing Library utilities) from `../test-utils`, **never** directly from `@testing-library/react`. The custom `render` in `test-utils.tsx` wraps the component with `NextIntlClientProvider`, which is required for any component that calls `useTranslations` or `useLocale`.

```typescript
// ✅ correct
import { render, fireEvent } from '../test-utils';

// ❌ incorrect — misses the i18n provider
import { render, fireEvent } from '@testing-library/react';
```

### Accessibility Testing

- Verify semantic HTML structure
- Test ARIA attributes and roles
- Check proper heading hierarchy
- Validate screen reader compatibility
- Test keyboard navigation support

### Mocking Patterns

- **Next.js Components**: Mock font and image components for testing
- **External Dependencies**: Mock third-party libraries
- **Component Dependencies**: Mock child components for isolation

Example mocking:

```typescript
import { vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Poppins: () => ({ className: 'mocked-poppins-font' }),
}));
```

## Scripts

- `npm run test` - Run all tests
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate coverage report and validate coverage thresholds
- `npm run check-types` - TypeScript type checking

## Coverage Requirements

- **Minimum**: 90% coverage on lines, functions, branches, and statements
- **Exclusions**: Configuration files, build artifacts, and test files

## Integration with Monorepo

- Fully integrated with Turborepo
- Consistent patterns with UI package testing
- Shared dependencies and configurations
- Works with monorepo-wide test and coverage commands

## Cosmic Theme Testing

The tests specifically validate:

- Cosmic-themed content and messaging
- Proper use of space-inspired color classes
- Heroicons integration and accessibility
- "Go Cosmic" branding consistency
- Dark theme implementation

## Best Practices

1. **Test Behavior, Not Implementation** - Focus on what users experience
2. **Accessibility First** - Always test ARIA attributes and semantic structure
3. **Isolation** - Mock dependencies to test components in isolation
4. **Cosmic Context** - Validate space-themed content and styling
5. **Consistent Patterns** - Follow the same testing patterns as the UI package
6. **Avoid Snapshots** - Snapshots are discouraged for components;

## Future Considerations

- Add visual regression tests for UI components
- Implement E2E testing for user workflows
- Add performance testing for cosmic animations
- Consider snapshot testing for complex layouts (use sparingly for pages/views only)
