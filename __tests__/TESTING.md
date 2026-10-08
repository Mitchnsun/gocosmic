# Testing Documentation for Web App

This document describes the testing patterns and configuration implemented for the Cosmic Studio web application.

## Overview

The app uses a unit test suite built on:

- **Vitest 3.2.4** - Fast unit testing framework
- **React Testing Library 16.3.2** - Component testing utilities
- **@testing-library/jest-dom** - Custom matchers for DOM assertions
- **@testing-library/user-event** - User interaction testing
- **jsdom** - DOM simulation for testing

## Configuration

### Test Configuration (`vitest.config.ts`)

- **Environment**: jsdom for DOM testing
- **Setup**: Automatic cleanup after each test, plus global mocks (see Mocking Patterns below)
- **Coverage**: 90% minimum threshold on lines, functions, branches, statements
- **Path Mapping**: Supports `@/` alias for imports
- **Excludes**: `app/**` (server components/pages), config files, build artifacts, and test files themselves (see `vitest.config.ts` for the full list)

### TypeScript Configuration

- **`tsconfig.json`**: Build configuration (excludes tests)
- **`tsconfig.check.json`**: Type checking configuration (includes tests)

## Test Structure

Follow the same folder structure as the project:

```
__tests__/
├── actions/            # Server action tests (contact, free-mockup)
├── components/         # Component tests
├── design-system/      # design-system primitives tests
├── i18n/                # i18n utility tests (canonical URLs)
├── lib/                 # Helper tests
├── next-config.test.ts  # next.config.ts tests
├── pages/                # Page tests
├── proxy.test.ts         # Middleware/proxy tests
├── test-setup.tsx        # Global test configuration
├── test-utils.tsx        # Custom render with NextIntlClientProvider
└── tsconfig.json         # TypeScript configuration for tests
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
  it('should render the "Cosmic Studio" title', () => {
    const { getByRole } = render(<Header />);

    const title = getByRole('heading', { name: /cosmic studio/i });
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
- Radix tabs switch on mouse down and keyboard, not on `click`: use `fireEvent.mouseDown(tab)` (or `userEvent.click`). Radix moves focus on the next tick (arrow keys, closing a popover), so assert focus inside `waitFor`

### Mocking Patterns

Global mocks configured in `test-setup.tsx`:

- **`@/i18n/navigation`**: `useRouter`, `usePathname`, `Link`, `redirect`, `getPathname` are mocked so navigation-driven components can render without a real router.
- **`motion/react`**: mocked so JSDOM doesn't process animation props.

Per-test mocking:

```typescript
import { vi } from 'vitest';

vi.mock('next/font/google', () => ({
  Inter: () => ({ className: 'mocked-inter-font' }),
}));
```

## Scripts

- `yarn test` - Run all tests
- `yarn test:watch` - Run tests in watch mode
- `yarn coverage` - Generate coverage report and validate coverage thresholds
- `yarn check-types` - TypeScript type checking
- `yarn qa` - Local QA of the production build with Playwright (`e2e/`, not run in CI): axe WCAG 2.1 A/AA audit of every route in both themes, the no-flash and theme toggle checks, and review screenshots at 360 / 768 / 1280 / 1440 px written to `e2e/screenshots/` (git-ignored). It builds and starts the app on port 3100, or reuses a server already there. First run on a machine: `yarn playwright install chromium`. `QA_LOCALE=en yarn qa` audits another locale.

Two unit tests guard the themes: `__tests__/design-system/theme-contrast.test.ts` checks the WCAG contrast of every semantic colour token read from `app/globals.css`, and `__tests__/design-system/theme-guard.test.ts` keeps raw theme colours (hex or RGB of ghost, void, cosmic-latte…) out of component code. Theme-dependent class names are guarded by ESLint.

## Coverage Requirements

- **Minimum**: 90% coverage on lines, functions, branches, and statements
- **Exclusions**: `app/**` (server components/pages, except top-level utilities like `app/robots.ts`, `app/sitemap.ts`, `app/not-found.tsx`), configuration files, build artifacts, and test files

## Best Practices

1. **Test Behavior, Not Implementation** - Focus on what users experience
2. **Accessibility First** - Always test ARIA attributes and semantic structure
3. **Isolation** - Mock dependencies to test components in isolation
4. **Consistent Patterns** - Reuse the patterns above across new tests
5. **No Snapshots** - Snapshot tests are discouraged for components and pages/views; assert behavior and accessibility attributes instead
