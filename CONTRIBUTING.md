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
7. Commit your changes using Conventional Commits format
8. Push to your fork and submit a pull request

### Code Style

This project uses:

- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [TypeScript](https://www.typescriptlang.org/) for type checking

Pre-commit hooks will automatically run these tools to ensure code quality.

## Questions?

If you have any questions about contributing, please open an issue or reach out to the maintainers.
