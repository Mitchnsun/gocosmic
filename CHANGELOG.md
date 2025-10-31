# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.1.1] - 2025-10-31

### Added

- New localized keys for email contact subject and aria-label in About page translations (EN, FR, ES, DE, IT)

### Changed

- About page: replace external contact link with mailto link to support@gocosmic.dev with localized subject
- About page: use i18n key for LinkedIn link aria-label for accessibility
- Update translations texts for offers and contact across multiple languages

## [1.1.0] - 2025-10-29

### Added

- Namespace-based organization for translation files (common, navigation, footer, home, about, services, offers, journey, projects)
- Dynamic namespace loading based on current route for optimized performance
- README_TLDR.md quick reference guide for developers
- Version and changelog management instructions in CONTRIBUTING.md and copilot-instructions.md

### Changed

- Translation files reorganized from single files per locale to namespace-based structure
- i18n configuration updated to support namespace-based loading
- Test utilities updated to merge all namespace files for testing

### Removed

- Legacy single-file translation structure

## [1.0.3] - 2025-10-28

### Added

- Daily Fortune application showcase page with multilingual support (EN, FR, ES, DE, IT)
- Internationalized routing for `/projects/daily-fortune` path

## [1.0.2] - 2025-10-15

### Added

- Remove mono repo, repo with just gocosmic website

## [1.0.1] - 2025-08-29

### Added

- Go Live /services

## [1.0.0] - 2025-08-27

### Added

- Go Live Homepage, /journey, /about
