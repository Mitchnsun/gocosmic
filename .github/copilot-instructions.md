# Go Cosmic - GitHub Copilot Instructions

Always reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.

**IMPORTANT**: Before making any changes or answering development questions, always read the `README.md` and `CONTRIBUTING.md` files at the root of the project to understand the project structure, development workflow, and contribution guidelines. These files contain essential context for working effectively on this codebase.

## Critical Requirements

**NEVER CANCEL BUILDS OR LONG-RUNNING COMMANDS** - Wait for all operations to complete. If a command appears to hang, wait at least 15 minutes before considering alternatives.

- Node.js >= 22 required (project specifies v22 in .nvmrc)
- Current system may run on Node v20.19.4 with warnings but works correctly
- yarn recommended

## Technology Stack

This project is a **modern React repo** built with cutting-edge technologies:

### Core Framework & Build Tools

- **Next.js 15.3.0** - React framework with App Router and Turbopack for fast development
- **React 19.1.0** - Latest React with server components and concurrent features
- **TypeScript 5.8.2** - Strict type checking across all packages
- **Vite** - Lightning-fast bundler for Storybook
- **next-intl** - Type-safe internationalization with 5 language support (EN, FR, ES, DE, IT)

### UI & Styling

- **TailwindCSS 4.x** - Utility-first CSS framework with custom design tokens
- **Radix UI** - Unstyled, accessible UI primitives (`@radix-ui/react-slot`)
- **Class Variance Authority (CVA)** - Type-safe component variants
- **clsx + tailwind-merge** - Intelligent CSS class merging and conditional styling

### Testing & Quality

- **Vitest** - Fast unit testing framework with 100% coverage enforcement
- **Testing Library** - React testing utilities (`@testing-library/react`, `@testing-library/user-event`)
- **ESLint 9.x** - Code linting with modern flat config and enhanced plugins:
  - `@eslint/js` - Core JavaScript rules
  - `typescript-eslint` - TypeScript-specific linting
  - `eslint-plugin-sonarjs` - Code smell detection and complexity analysis
  - `eslint-plugin-security` - Security vulnerability detection
  - `eslint-plugin-unicorn` - Modern JavaScript/TypeScript best practices
  - `eslint-plugin-import` - Import/export validation
  - `eslint-plugin-simple-import-sort` - Automatic import sorting
  - `eslint-plugin-unused-imports` - Automatic unused import removal
  - `eslint-plugin-jsx-a11y` - Accessibility enforcement for React
  - `eslint-plugin-prettier` - Prettier integration
- **Prettier** - Code formatting with Tailwind plugin
- **Husky + lint-staged** - Git hooks for pre-commit validation

### Development Tools

- **JSDOM** - DOM simulation for testing
- **Commitlint** - Conventional commit message validation
- **Autoprefixer** - CSS vendor prefixing

### Architecture Patterns

- **Component-driven development** with isolated testing in Storybook
- **Design system approach** with reusable UI components
- **100% test coverage** enforcement for reliability
- **Dual TypeScript configs** for clean builds and comprehensive type checking
- **Internationalization-first** with type-safe translations and locale-specific routing

## Coding Standards

The project enforces **strict coding standards** to ensure code quality and consistency:

- **TypeScript-first approach** with strict type checking across all packages
- **ESLint 9.x** with flat config, enhanced plugins, and zero warnings policy (`--max-warnings 0`)
- **Enhanced ESLint plugins** including SonarJS (code quality), Security (vulnerability detection), and Unicorn (modern practices)
- **Prettier** for automatic code formatting with consistent styling
- **Import management** with `eslint-plugin-simple-import-sort` and automatic unused import removal
- **Conventional Commits** enforced via commitlint with custom types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `tech`, `chore`
- **Pre-commit hooks** via Husky + lint-staged that automatically format code and run linting
- **Accessibility enforcement** with jsx-a11y plugin for React components
- **100% test coverage** requirement on UI package with comprehensive Vitest testing
- **Component patterns** following React best practices with proper TypeScript interfaces and JSDoc documentation

All code changes must pass formatting, linting, type checking, and testing before being committed. The CI will fail if any standard is not met.

## Commit Message Convention

The project strictly enforces **Conventional Commits** specification for all commit messages. This ensures consistency, improves readability of the git history, and enables automated tooling for changelog generation and versioning.

### Format Structure

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

The following commit types are enforced via commitlint:

- **feat** - A new feature for the user
- **fix** - A bug fix for the user
- **docs** - Documentation only changes
- **style** - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor** - A code change that neither fixes a bug nor adds a feature
- **perf** - A code change that improves performance
- **test** - Adding missing tests or correcting existing tests
- **tech** - Upgrade or update dependencies and improve the codebase
- **chore** - Changes to the build process or auxiliary tools and libraries such as documentation generation

### Description Rules

- **Imperative mood** - Use "add feature" not "added feature" or "adds feature"
- **Lowercase** - Start with lowercase letter
- **No period** - Do not end with a period
- **Max 69 characters** - Keep it concise and scannable
- **English only** - All commit messages must be in English

### Scope Guidelines

The scope is optional but **highly recommended** for clarity:

- `ui` - Changes to the UI components in design-system folder (`design-system/`)
- `config` - Changes to configuration files (ESLint, TypeScript, etc.)
- `deps` - Dependency updates and package management
- `docs` - Documentation changes

### Body Format

When adding a body (optional):

- **Blank line** after the description
- **Wrap at 72 characters** for readability
- **Explain what and why** - not how
- **Multiple paragraphs** allowed, separated by blank lines

### Footer Format

Use the footer for:

- **Issue references**: `Fixes #123`, `Closes #456`, `Refs #789`
- **Breaking changes**: `BREAKING CHANGE: remove deprecated API`
- **Co-authored commits**: `Co-authored-by: Name <email@example.com>`

### Examples

#### ✅ Good Commit Messages

```bash
feat(ui): add cosmic Button component with variants

refactor(web): simplify navigation state management

docs: update README installation instructions

fix(ui): resolve button focus styles in dark mode

test(web): add unit tests for user authentication flow

tech(deps): update Next.js to version 15

perf(ui): optimize component rendering with memo

feat(web): add user dashboard with data visualization

The dashboard includes charts for usage analytics and
provides real-time updates through WebSocket connections.

Fixes #42
```

#### ❌ Bad Commit Messages

```bash
Added new feature
Fixed bug
Update
WIP
Minor changes
feat: Adding a new component (wrong tense)
fix(ui): Fix the button. (period at end, not imperative)
FEAT(ui): Add button (wrong case)
feat(ui): add a very long description that exceeds fifty characters (too long)
```

### Breaking Changes

Indicate breaking changes in two ways:

1. **Add `!` after type/scope**: `feat(ui)!: remove deprecated Button props`
2. **Use footer**: `BREAKING CHANGE: remove deprecated Button API`

### Validation

All commits are automatically validated by:

- **Husky pre-commit hooks** - Run before each commit
- **Commitlint** - Enforces conventional format and rules
- **CI/CD pipeline** - Fails build if conventions not followed

For detailed contribution guidelines, see [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## UI Guidelines

The project follows **modern, clean design principles** with a distinctive **cosmic theme**:

- **Modern & Minimalist** - Clean layouts with generous whitespace, subtle shadows, and smooth transitions
- **Cosmic Theme** - Space-inspired color palette with deep blacks, cosmic blues, and stellar accents
- **Accessibility First** - All components must meet WCAG standards using Radix UI primitives
- **Component-driven Design** - Reusable, composable components documented in Storybook
- **Design System Approach** - Consistent spacing, typography, and color tokens across all interfaces
- **Responsive Design** - Mobile-first approach with fluid layouts and adaptive components
- **Smooth Interactions** - Thoughtful micro-interactions and animations that enhance the cosmic experience
- **Dark Mode Ready** - Components designed with both light and dark themes in mind

All UI components should evoke a sense of exploration and wonder while maintaining professional usability and performance.

## Working Effectively

### Essential Reading

**Before starting development, read these files to understand the project:**

- **`README.md`** - Project overview, setup instructions, and architecture
- **`CONTRIBUTING.md`** - Development workflow, coding standards, and contribution guidelines

### Bootstrap and Setup

1. Clone repository and navigate to root directory
2. **Install dependencies**: `yarn install` -- takes approximately 3.5 minutes. NEVER CANCEL. Set timeout to 15 minutes.
3. **UI package TypeScript configuration**: The UI package uses a dual TypeScript configuration:
   - `tsconfig.json`: Compiles only `src/` to `dist/` for clean library output
   - `tsconfig.check.json`: Type-checks both `src/` and `__tests__` with `noEmit: true`

### Build Process

- **Full build**: `yarn build` -- takes approximately 34 seconds. NEVER CANCEL. Set timeout to 10 minutes.

### Development Workflow

- **Start development server**: `yarn dev`

### Testing and Quality

- **Run all tests**: `yarn test` -- takes approximately 4 seconds (48 tests). NEVER CANCEL. Set timeout to 10 minutes.
- **Web app testing**: Web app has comprehensive unit tests for components, pages, and views using Vitest and React Testing Library
- **Test coverage**: `yarn coverage` -- generates coverage reports for all packages. Coverage should meet thresholds (100% for UI package, 80% for apps). NEVER CANCEL. Set timeout to 15 minutes.
- **Type checking**: `yarn check-types` -- takes approximately 9 seconds. NEVER CANCEL. Set timeout to 10 minutes.
- **Linting**: `yarn lint` -- takes approximately 7 seconds. NEVER CANCEL. Set timeout to 10 minutes.
- **Code formatting**: `yarn format` -- takes approximately 2 seconds

### Pre-commit Validation

**ALWAYS run these commands before committing or the CI will fail:**

1. `yarn format`
2. `yarn lint`
3. `yarn check-types`
4. `yarn test`
5. `yarn coverage` -- ensures coverage thresholds are met

## Manual Validation Scenarios

**CRITICAL**: After making changes, always test actual functionality:

### Web Application Testing

1. Build and start web app: `yarn dev`
2. Access http://localhost:3000
3. Verify page loads with "Go Cosmic" heading
4. Test button interactions:
   - Click "Try me" button - should show alert
   - Click "Cosmic developer" link - should open external link
5. Verify styles and layout render correctly
6. Test language switching:
   - Use language switcher to change between EN, FR, ES, DE, IT
   - Verify URLs change to locale-prefixed format (/en/, /fr/, etc.)
   - Verify content is properly translated
   - Test browser back/forward navigation
7. Run web app tests: `yarn test` -- comprehensive unit tests for components, pages, and views

## Repository Structure

### Key Files and Directories

- **`package.json`** - Root package with npm scripts and workspaces
- **`.husky/`** - Git hooks for pre-commit validation
- **`commitlint.config.js`** - Commit message validation (Conventional Commits)

## Common Patterns and Troubleshooting

### Development Server Issues

- If `yarn dev` hangs, use individual package dev commands instead
- Web app uses Next.js with Turbopack for fast development

### Internationalization (i18n)

The web application uses next-intl for comprehensive multilingual support:

- **Supported Languages**: English (en), French (fr), Spanish (es), German (de), Italian (it)
- **Translation Files**: Located in `messages/` with complete message structure per locale
- **URL Structure**: Locale-prefixed routes (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Translated Pathnames**: Route paths are localized for SEO and UX (e.g., `/en/about` → `/fr/a-propos`)
- **Type Safety**: Full TypeScript integration with compile-time validation of translation keys
- **Testing**: Custom test utilities provide next-intl context for component testing

#### Working with Translations

- **Reference Language**: English (`en.json`) is the base language with complete message structure
- **Adding Keys**: Add new translation keys to `en.json` first, then translate to other locales
- **Testing i18n Components**: Use custom render from `__tests__/test-utils.tsx` for components using translations
- **Navigation Mocking**: Global mocks for `next/navigation` are configured in test setup

#### Adding New Routes

When adding new routes to the application, follow this procedure:

1. **Create the route**: Add the new page component in `app/[locale]/your-route/page.tsx`
2. **Configure pathnames**: Update `i18n/routing.ts` to add translated pathnames:
   ```typescript
   pathnames: {
     '/your-route': {
       en: '/your-route',
       fr: '/votre-route',
       es: '/tu-ruta',
       de: '/ihre-route',
       it: '/la-tua-route',
     },
   }
   ```
3. **Add translations**: Include any new translation keys in all locale files (`messages/`)
4. **Update navigation**: If the route needs navigation links, add them to navigation components
5. **Test thoroughly**: Ensure the route works correctly in all locales and test the functionality

#### Translation File Structure

```
messages/
├── en.json    # English (base/reference)
├── fr.json    # French translations
├── es.json    # Spanish translations
├── de.json    # German translations
└── it.json    # Italian translations
```

All translation files maintain the same nested structure for consistency and type safety.

### Build Failures

- Build failures usually indicate missing UI package build or TypeScript errors
- Run `yarn check-types` to isolate TypeScript issues
- Ensure all dependencies are installed with `yarn`

### Git Workflow

- All commits must follow Conventional Commits format (enforced by git hooks)
- Pre-commit hooks run lint-staged and validate commit messages
- **See detailed commit guidelines above** for comprehensive formatting rules
- Types: feat, fix, docs, style, refactor, perf, test, tech, chore

### Coverage System

- **Testing**: All components are thoroughly tested with Vitest and React Testing Library
- **`yarn coverage`** - Generates comprehensive coverage reports in multiple formats:
  - Terminal output with coverage percentages
  - HTML report at `coverage/index.html` for detailed visualization
  - JSON report for CI/CD integration
  - Validates that coverage meets the 80% thresholds:
    - **Lines**: 80% (every line must be executed)
    - **Functions**: 80% (every function must be called)
    - **Branches**: 80% (every conditional branch must be tested)
    - **Statements**: 80% (every statement must be executed)
- **Coverage exclusions** configured in `vitest.config.ts`:
  - `index.ts` - Export-only files
  - `turbo/generators/**` - Configuration files
  - `__tests__/` - Test files themselves
  - `**/*.test.*` and `**/*.spec.*` - Test files
  - `dist/` and `node_modules/` - Build artifacts

**CRITICAL**: `coverage` will fail CI if any threshold drops below 80%. This ensures every new feature or change is properly tested.

## Commands Reference

### Root Level Commands

```bash
npm install              # 3.5 min - Install all dependencies
yarn build           # 34 sec - Build all packages
yarn dev             # Start all dev servers (use individual commands if hanging)
yarn lint            # 7 sec - Lint all packages
yarn format          # 2 sec - Format all code
yarn check-types     # 9 sec - Type check all packages
yarn test            # 4 sec - Run all tests (48 tests total)
yarn coverage        # Generate test coverage reports (HTML + JSON)
```

**Remember**: Always wait for commands to complete. Build times of 15+ minutes are normal for some projects. NEVER CANCEL operations prematurely.
