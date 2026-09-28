import js from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import onlyWarn from 'eslint-plugin-only-warn';
import prettierPlugin from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import securityPlugin from 'eslint-plugin-security';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** Class names drawing on a default Tailwind palette, e.g. `text-slate-400` or `hover:bg-blue-500/50`. */
const OFF_PALETTE =
  '/(^|[\\s:-])(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}/';

/**
 * Class names drawing on a nominal colour that depends on the theme, e.g. `bg-void` or `hover:text-ghost/70`.
 * Components use the semantic tokens instead (`bg-bg`, `text-fg`, `border-line`…), see DESIGN_GUIDELINE.md §2.1.
 * `text-void` stays allowed: it is the dark label on orange fills, identical in both themes. Orange and purple
 * text use `text-aerospace-ink` / `text-royal-ink`, tuned per theme so small labels keep a 4.5:1 contrast.
 */
const THEME_NOMINAL =
  '/(^|[\\s:])((bg|border|border-[trblxy]|divide|ring|ring-offset|outline|from|via|to|shadow|fill|stroke|placeholder|caret|decoration)-(void|ghost|space|ember|jungle)|text-(ghost|space|ember|jungle|aerospace|royal))(?![\\w-])/';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,
  securityPlugin.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
      unicorn: unicornPlugin,
      'unused-imports': unusedImportsPlugin,
      'simple-import-sort': simpleImportSortPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'unused-imports/no-unused-imports': 'error',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/filename-case': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'clsx',
              message: "Use `cn` from '@/design-system/lib/utils' instead of importing clsx directly.",
            },
          ],
        },
      ],
    },
  },
  {
    // Colours come from the semantic theme tokens (bg, fg, line, ok…) plus aerospace, never from
    // Tailwind's default palettes nor from theme-dependent nominal tokens. See DESIGN_GUIDELINE.md §2.1.
    files: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'design-system/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: `Literal[value=${OFF_PALETTE}], TemplateElement[value.raw=${OFF_PALETTE}]`,
          message: 'Use a theme colour token instead of a default Tailwind palette (slate, gray, blue…).',
        },
        {
          selector: `Literal[value=${THEME_NOMINAL}], TemplateElement[value.raw=${THEME_NOMINAL}]`,
          message:
            'Use a semantic colour token (bg, bg-alt, surface, fg, fg-2, fg-3, line, line-2, ok…) so the class follows the theme.',
        },
      ],
    },
  },
  {
    files: ['design-system/lib/utils.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
      },
    },
  },
  pluginJsxA11y.flatConfigs.recommended,
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    plugins: {
      onlyWarn,
    },
  },
  {
    files: ['__tests__/**/*', '**/*.test.*', '**/*.spec.*'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      '.next/**',
      'node_modules/**',
      'coverage/**',
      '**/__snapshots__/**',
      'messages/**',
      'public/**',
      'next-env.d.ts',
      '.eslintcache',
    ],
  },
];

export default config;
