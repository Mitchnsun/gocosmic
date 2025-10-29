# Contributing to Go Cosmic

Embark on your journey among the stars, thanks to you for helping shape gocosmic.dev! This guide will navigate you through our contribution process and community guidelines.

## Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for all commit messages. This ensures consistency, improves readability of the git history, and enables automated tooling for changelog generation and versioning.

### Format

Each commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Formatting Rules

- **Description**: Use imperative mood, lowercase, no period, max 69 characters
- **Body**: Wrap at 72 characters, explain what and why (not how)
- **Language**: All commit messages must be written in English
- **Line breaks**: Use blank lines to separate description, body, and footer sections

### Types

The following commit types are allowed:

- **feat**: A new feature for the user
- **fix**: A bug fix for the user
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **tech**: Upgrade or update dependencies and improve the codebase
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Scope

The scope is optional and should be a noun describing a section of the codebase surrounded by parenthesis, e.g., `feat(ui):`, `fix(web):`, `docs(readme):`.

Common scopes in this project include:

- `ui` - Changes to the UI package
- `web` - Changes to the web application
- `docs` - Changes to the docs application
- `config` - Changes to configuration files
- `deps` - Dependency updates

### Examples

#### Good commit messages:

```
feat(ui): add new Button component with variants

fix(web): resolve navigation issue on mobile devices

docs: update README with installation instructions

tech(deps): update Next.js to version 14

refactor(ui): simplify component prop interface

test(web): add unit tests for user authentication

feat(web): add user dashboard with analytics

Implements a comprehensive dashboard showing user activity
metrics, performance charts, and real-time data updates
through WebSocket connections.

The dashboard supports multiple themes and responsive
design for mobile and desktop viewports.

Fixes #123
Closes #456

perf(ui): optimize Button component rendering

Use React.memo to prevent unnecessary re-renders when
props haven't changed, improving performance for lists
with many buttons.

BREAKING CHANGE: removed deprecated 'size' prop, use 'variant' instead
```

#### Bad commit messages:

```
Added new feature
Fixed bug
Update
WIP
Minor changes
feat: Adding a new component (wrong tense)
fix(ui): Fix the button. (period at end, not imperative)
FEAT(ui): Add button (wrong case)
feat(ui): add a very long description that exceeds the fifty character limit (too long)
```

### Breaking Changes

Breaking changes should be indicated in the commit message:

1. Add `!` after the type/scope: `feat!: remove deprecated API`
2. Or mention it in the footer: `BREAKING CHANGE: remove deprecated API`

### Pull Request Guidelines

- Ensure all commits in your PR follow the Conventional Commits format
- Keep commits atomic and focused on a single change
- Write clear, descriptive commit messages
- Include tests for new features and bug fixes
- Ensure all tests pass and linting is clean
- Update documentation as needed
- **Update version and changelog**: Before opening a PR, you must:
  1. Increment the version number in `package.json` following [Semantic Versioning](https://semver.org/)
  2. Add a new entry in `CHANGELOG.md` with the version number and current date
  3. List all features, fixes, and changes under the appropriate sections (Added, Changed, Fixed, Removed)

### PR Title Format

All pull request titles must follow this format:

```
[TYPE] Description
```

Where `TYPE` is one of the following (in uppercase):

- **FEAT** - New feature
- **FIX** - Bug fix
- **DOCS** - Documentation changes
- **STYLE** - Code style changes (formatting, missing semi-colons, etc.)
- **REFACTOR** - Code refactoring
- **PERF** - Performance improvements
- **TEST** - Adding or updating tests
- **TECH** - Upgrade or update dependencies and improve the codebase
- **CHORE** - Build process or tooling changes

#### Good PR titles:

```
[FEAT] Add dark mode toggle component
[FIX] Resolve mobile navigation overflow issue
[DOCS] Update API documentation for authentication
[REFACTOR] Simplify user state management
[TECH] Update dependencies to latest versions
[CHORE] Update build configuration
```

#### Bad PR titles:

```
Update component
Fix bug
Add feature
Minor changes
WIP: Working on new feature
```

### Development Workflow

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes following our coding standards
4. Write or update tests as needed
5. Ensure all tests pass: `npm run test`
6. Ensure linting passes: `npm run lint`
7. **Update version and changelog**:
   - Increment the version number in `package.json` following [Semantic Versioning](https://semver.org/):
     - **MAJOR** version for incompatible API changes
     - **MINOR** version for new functionality in a backwards compatible manner
     - **PATCH** version for backwards compatible bug fixes
   - Add a new entry in `CHANGELOG.md` with the format:

     ```markdown
     ## [X.Y.Z] - YYYY-MM-DD

     ### Added

     - New feature descriptions

     ### Changed

     - Changes in existing functionality

     ### Fixed

     - Bug fixes

     ### Removed

     - Removed features
     ```

8. Commit your changes using Conventional Commits format
9. Push to your fork and submit a pull request

### First Time Setup

If this is your first time working on the project:

```bash
# Enable Corepack for yarn (first time only)
corepack enable

# Install dependencies
yarn
```

### Working with Translations

The project uses next-intl for internationalization with translations organized by namespace for better maintainability and on-demand loading for optimal performance.

#### Translation File Structure

Translations are organized in namespace-based files:

```
messages/
  ├── [locale]/
  │   ├── common.json      # Shared strings (404, meta, language switcher)
  │   ├── navigation.json  # Header navigation labels
  │   ├── footer.json      # Footer content
  │   ├── home.json        # Homepage content
  │   ├── about.json       # About page content
  │   ├── services.json    # Services page content
  │   ├── offers.json      # Offers page content
  │   ├── journey.json     # Journey page content
  │   └── projects.json    # Project pages content
```

**Dynamic Loading**: The application intelligently loads only the necessary namespaces for each route:

- Shared namespaces (`common`, `navigation`, `footer`) are always loaded
- Page-specific namespaces are loaded on-demand based on the current route
- This approach reduces bundle size and improves performance

#### Adding New Translations

1. **Identify the appropriate namespace**: Determine which namespace file should contain your new translation keys
2. **Update English first**: Always add new keys to `messages/en/[namespace].json` first (English is the base language)
3. **Translate to all locales**: Add the same keys to all other locale files (fr, es, de, it)
4. **Use in components**: Import and use with `useTranslations` hook:

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  return <div>{t('key')}</div>;
}
```

#### Adding New Routes

When adding new routes that require translations:

1. Create or update the appropriate namespace file for all locales
2. Update `i18n/routing.ts` to add translated pathnames
3. Update `i18n/request.ts` in the `getNamespacesForPath` function to map the new route to its namespace
4. Update test utilities in `__tests__/test-utils.tsx` to import the new namespace

#### Guidelines

- **Keep namespaces focused**: Each namespace should correspond to a specific section or page
- **Maintain consistency**: Use the same structure across all locale files
- **Avoid duplication**: Shared strings should go in `common.json`, `navigation.json`, or `footer.json`
- **Test thoroughly**: Ensure all locales have complete translations (no missing keys)
- **Update route mapping**: When adding new pages, update `getNamespacesForPath` in `i18n/request.ts` for optimal loading

### Code Style

This project uses:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [TypeScript](https://www.typescriptlang.org/) for type checking

Pre-commit hooks will automatically run these tools to ensure code quality.

## Questions?

If you have any questions about contributing, please open an issue or reach out to the maintainers.
