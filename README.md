# Go Cosmic Web - Main Application

The main web application of the Go Cosmic ecosystem, serving as the public showcase and business platform for the Go Cosmic development team. This platform is designed to **present Go Cosmic's work, showcase their applications, introduce the team, and promote their development services** to potential clients and collaborators.

- **Company Overview**: Presents Go Cosmic's mission and areas of specialization
- **Developer Profile**: Highlights Matthieu Compérat's expertise and experience
- **Legal & AI Usage**: Transparent statements about AI usage, privacy, and responsibility
- **Accessibility**: Semantic headings, descriptive aria-labels, and keyboard focus styles
- **SEO Ready**: Metadata and Open Graph descriptions optimized per locale
- **Multilingual Support**: Complete translation coverage for professional presentationapplication of the Go Cosmic ecosystem, serving as the public showcase and business platform for the Go Cosmic development team. This platform is designed to **present Go Cosmic's work, showcase their applications, introduce the team, and promote their development services** to potential clients and collaborators.

## Primary Objectives

The Go Cosmic website serves as the primary business interface with the following goals:

- **Portfolio Showcase**: Present Go Cosmic's applications and development projects
- **Team Presentation**: Introduce the talented developers and their expertise
- **Service Promotion**: Highlight development services offered to potential clients
- **Brand Identity**: Establish Go Cosmic as a leading cosmic-themed development team
- **Client Acquisition**: Convert visitors into clients through compelling presentation

## Current Features

### Internationalization (i18n)

- **5 Languages**: Complete support for English, French, Spanish, German, and Italian
- **Type-Safe Translations**: Full TypeScript integration with compile-time validation
- **SEO Optimization**: Dynamic metadata and lang attributes per locale
- **Clean URLs**: Locale-prefixed routing (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Translated Pathnames**: Route paths are localized for better SEO and UX (e.g., `/en/about` → `/fr/a-propos`, `/en/journey` → `/de/reise`)
- **Browser Detection**: Automatic locale detection based on user preferences
- **Language Switcher**: Intuitive dropdown component with flag icons and current language indication
- **Namespace Organization**: Translation files are organized by namespace for better maintainability and scalability

#### Translation File Structure

Translations are organized into namespace-based files for improved organization and maintainability:

```
messages/
  ├── en/              # English translations
  │   ├── common.json      # Shared strings (404, meta, language switcher)
  │   ├── navigation.json  # Header navigation labels
  │   ├── footer.json      # Footer content
  │   ├── home.json        # Homepage content
  │   ├── about.json       # About page content
  │   ├── services.json    # Services page content
  │   ├── offers.json      # Offers page content
  │   ├── journey.json     # Journey page content
  │   └── projects.json    # Project pages content
  ├── fr/              # French (same structure)
  ├── es/              # Spanish (same structure)
  ├── de/              # German (same structure)
  └── it/              # Italian (same structure)
```

**Benefits of namespace organization:**

- **Better maintainability**: Each namespace is self-contained and easier to manage
- **Improved scalability**: Adding new pages requires only creating/updating specific namespace files
- **Clear separation**: Shared components (navigation, footer) have dedicated namespaces
- **Easier collaboration**: Multiple developers can work on different namespaces without conflicts
- **Optimized loading**: Only necessary namespaces are loaded per route for better performance

**Dynamic Loading:**

The application uses intelligent on-demand loading:

- **Shared namespaces** (`common`, `navigation`, `footer`) are loaded on every page
- **Page-specific namespaces** are loaded only when needed based on the current route
- This reduces bundle size and improves initial load times

**Usage in components:**

Components use the `useTranslations` hook with the appropriate namespace:

```tsx
import { useTranslations } from 'next-intl';

// In a page component
export default function HomePage() {
  const t = useTranslations('homepage');
  return <h1>{t('hero.title')}</h1>;
}

// In a shared component
export default function Header() {
  const t = useTranslations('navigation');
  return <nav>{t('label')}</nav>;
}
```

### Homepage

- **Hero Section**: Engaging introduction with "Go Cosmic" branding and call-to-action
- **Interactive Button**: Demonstration of UI components with alert functionality
- **Team Link**: Direct access to learn more about the development team
- **Cosmic Design**: Universe-inspired design with celestial UI components
- **Responsive Layout**: Optimized for all device sizes
- **Multilingual Content**: All text content fully translated across 5 languages

### Journey Page (`/journey`)

- **3D Cosmic Experience**: Interactive starfield using Three.js and React Three Fiber
- **Dynamic Loading**: Utilizes Next.js dynamic imports for optimal performance
- **Immersive Animation**: 2000+ animated stars with realistic physics
- **Loading State**: Smooth transition with cosmic-themed loading spinner
- **SSR Optimization**: Client-side rendering to avoid WebGL server-side issues

### About Page (`/about`)

- **Company Overview**: Presents Go Cosmic's mission and areas of specialization
- **Developer Profile**: Highlights Matthieu Compérat's expertise and experience
- **Legal & AI Usage**: Transparent statements about AI usage, privacy, and responsibility
- **Accessibility**: Semantic headings, descriptive aria-labels, and keyboard focus styles
- **SEO Ready**: Metadata and Open Graph descriptions optimized in the page's `metadata`

### Services Page (`/services`)

- **Stellar Development**: Modern web development expertise with cutting-edge technologies
- **Mystical UI/UX Design**: Immersive, accessible, and conversion-focused design approach
- **AI Powered Solutions**: Intelligent features leveraging modern AI capabilities
- **Cosmic Launch**: Complete launch support from development to production

### Offers Page (`/offers`)

- **Solo Cosmic Developer**: Dedicated developer for startups and small projects
- **Complete Cosmic Team**: Full-stack solutions for complex, enterprise-grade projects
- **Developer + Designer Duo**: Combined technical excellence and stunning design

### Projects Section

#### Daily Fortune (`/projects/daily-fortune`)

- **Project Showcase**: Comprehensive presentation of the Daily Fortune mobile application
- **Features Overview**: Key features including daily fortunes, motivational content, and cosmic design
- **Technology Stack**: Details about modern technologies used (Next.js, TypeScript, React Native, TailwindCSS)
- **AI Integration**: Information about AI-powered fortune generation
- **Multilingual Support**: Complete translation coverage in 5 languages
- **Call-to-Action**: Repository link for exploring the project

### Technical Features

- **Optimal Performance**: Server-side rendering and automatic optimizations
- **Modern Architecture**: Built with Next.js 15 and React 19
- **Type Safety**: Full TypeScript implementation
- **Component System**: Reusable UI components with proper JSDoc documentation

## Future Enhancements

- **More Projects**: Additional project showcases beyond Daily Fortune
- **Team Profiles**: Individual developer profiles with skills and experience
- **Contact System**: Professional contact forms and consultation booking
- **Case Studies**: In-depth presentation of successful client projects
- **Testimonials**: Client feedback and success stories
- **Blog/Articles**: Technical insights and company updates

## Development Setup

### Prerequisites

- Node.js >= 22
- yarn (via Corepack)

### Installation and Launch

```bash
# Enable Corepack for yarn (first time only)
corepack enable

# Install dependencies (if not already done)
yarn

# Launch web app in development
yarn dev
```

The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Available Scripts

```bash
# Development
yarn dev

# Production build
yarn build

# Production launch
yarn start

# Linting
yarn lint

# Testing
yarn test           # Run unit tests
yarn test:watch     # Run tests in watch mode
yarn coverage       # Generate test coverage report
```

### Adding New Routes

When adding new routes to the application, follow this procedure to maintain internationalization consistency:

1. **Create the route**: Add the new page component in `app/[locale]/your-route/page.tsx`

2. **Configure translated pathnames**: Update `i18n/routing.ts` to add localized route paths:

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

3. **Add translations**: Include any new translation keys in all locale message files (`messages/`)

4. **Update navigation**: If the route needs navigation links, add them to relevant navigation components

5. **Test thoroughly**: Ensure the route works correctly in all locales and verify functionality

This approach ensures SEO-friendly URLs and consistent user experience across all supported languages.

## Technologies Used

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - Latest React with server components
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - Type safety and robust development
- **[next-intl](https://next-intl.dev/)** - Type-safe internationalization with 5 language support
- **[TailwindCSS 4.x](https://tailwindcss.com/)** - Styling with cosmic design system
- **[Three.js](https://threejs.org/)** - 3D graphics and interactive experiences
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js
- **[Heroicons](https://heroicons.com/)** - Beautiful hand-crafted SVG icons
- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities

## Testing

The application includes comprehensive unit tests covering components, pages, and views. Tests follow accessibility-first principles and validate cosmic theme consistency.

### Test Structure

```
__tests__/
├── components/      # Component unit tests
├── design-system/   # Components from design-system unit tests
├── pages/           # Page component tests
├── views/           # View component tests
├── test-setup.tsx   # Global test configuration
└── test-utils.tsx   # Custom render utilities with i18n context
```

### Test Utils with Internationalization

The `test-utils.tsx` file provides a custom render function that includes next-intl context for testing components that use translations. It merges all namespace files into a single messages object:

```tsx
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Import all namespace files
import common from '../messages/en/common.json';
import navigation from '../messages/en/navigation.json';
import footer from '../messages/en/footer.json';
// ... other namespaces

// Merge all namespaces
const messages = {
  ...common,
  ...navigation,
  ...footer,
  // ... other namespaces
};

// Custom render with i18n context
const customRender = (ui, options) =>
  render(ui, {
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        {children}
      </NextIntlClientProvider>
    ),
    ...options,
  });

export { customRender as render };
```

### Navigation Mocking

For components using Next.js navigation hooks, global mocks are configured:

```tsx
// Mock next/navigation for testing
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en',
}));
```

### Best Practices

- **Behavior-focused testing** - Tests validate user experience, not implementation details
- **Accessibility validation** - All tests verify ARIA attributes and semantic structure
- **Cosmic theme validation** - Tests ensure consistent space-inspired styling
- **i18n Testing** - Components using translations are tested with proper context
- **Mock strategy** - External dependencies are properly mocked for isolation
- **Snapshot avoidance** - Snapshots are discouraged for components, tolerated for pages/views only

For detailed testing guidelines, see [`__tests__/TESTING.md`](./__tests__/TESTING.md).

## Architecture

```
apps/web/
├── app/              # App Router (Next.js 15+)
│   ├── [locale]/     # Internationalized routes
│   │   ├── about/    # About page (mission, profile, legal & AI usage)
│   │   ├── journey/  # 3D cosmic experience page
│   │   ├── services/ # Services page (development, design, AI, launch)
│   │   ├── offers/   # Offers page (solo, team, duo packages)
│   │   ├── projects/ # Projects showcase
│   │   │   └── daily-fortune/ # Daily Fortune project page
│   │   └── page.tsx  # Homepage
│   ├── layout.tsx    # Root layout with i18n provider
│   └── ...
├── components/       # App-specific components
│   ├── LanguageSwitcher/ # Multilingual navigation component
│   └── icons/        # Reusable SVG icons (e.g., LinkedInIcon)
├── messages/         # Translation files organized by namespace
│   ├── en/           # English translations
│   │   ├── common.json     # Common UI strings (404, meta, language)
│   │   ├── navigation.json # Header navigation
│   │   ├── footer.json     # Footer content
│   │   ├── home.json       # Homepage content
│   │   ├── about.json      # About page content
│   │   ├── services.json   # Services page content
│   │   ├── offers.json     # Offers page content
│   │   ├── journey.json    # Journey page content
│   │   └── projects.json   # Project pages content
│   ├── fr/           # French translations (same structure)
│   ├── es/           # Spanish translations (same structure)
│   ├── de/           # German translations (same structure)
│   └── it/           # Italian translations (same structure)
├── i18n/            # Internationalization configuration
│   ├── routing.ts    # Locale routing setup with translated pathnames
│   ├── request.ts    # Server-side i18n configuration
│   └── navigation.ts # Client-side navigation utilities
├── views/           # View components (e.g., Journey content)
├── __tests__/       # Comprehensive unit tests
│   ├── components/  # Component tests
│   ├── pages/       # Page tests
│   ├── views/       # View tests
│   └── test-utils.tsx # Custom render with i18n context
├── middleware.ts    # Locale detection and routing
├── public/          # Static assets and icons
└── ...
```

For more information about the project's general architecture, see the [main README](../../README.md).
