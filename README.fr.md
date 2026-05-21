# Go Cosmic Web - Application principale

L'application web principale de l'écosystème Go Cosmic, utilisée comme vitrine publique et plateforme business de l'équipe. Elle sert à **présenter les réalisations, l'équipe et les offres de développement**.

> Référence technique exhaustive (canonique EN) : [README.en.md](./README.en.md)

## Objectifs principaux

Le site Go Cosmic a pour objectifs :

- **Vitrine portfolio** : mettre en avant les applications et projets livrés
- **Présentation de l'équipe** : valoriser les expertises techniques et design
- **Promotion des services** : clarifier les offres pour prospects et clients
- **Identité de marque** : renforcer l'univers et le positionnement Go Cosmic
- **Acquisition client** : transformer les visites en prises de contact qualifiées

## Fonctionnalités actuelles

### Internationalisation (i18n)

- **5 langues** : anglais, français, espagnol, allemand, italien
- **Traductions typées** : validation TypeScript des clés
- **SEO localisé** : métadonnées et attributs `lang` par locale
- **URLs propres** : routage préfixé (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Slugs traduits** : chemins localisés (ex. `/en/about` -> `/fr/a-propos`)
- **Détection navigateur** : locale automatique selon préférences utilisateur
- **Language switcher** : menu de changement de langue avec indication visuelle

### Pages et parcours

- **Accueil** : hero, CTA, identité visuelle cosmique
- **Journey (`/journey`)** : expérience 3D immersive (Three.js / R3F)
- **About (`/about`)** : mission, profil, cadre légal et usage IA
- **Services (`/services`)** : développement, design, IA, lancement
- **Offers (`/offers`)** : offres solo / équipe / duo
- **Contact (`/contact`)** : formulaire de prise de contact
- **Local (`/local`)** : landing pages SEO locales
- **Projects (`/projects/*`)** : pages vitrines des projets

### Projets présentés

- **Daily Fortune**
- **mcomperat**
- **PSC Supersprint**
- **Choeur des Pays du Mont Blanc**

## Mise en route

### Prérequis

- Node.js >= 22
- Yarn via Corepack

### Installation et lancement

```bash
# Activer Corepack (première fois)
corepack enable

# Installer les dépendances
yarn

# Lancer l'application en développement
yarn dev
```

Application disponible sur [http://localhost:3000](http://localhost:3000).

## Scripts disponibles

```bash
# Développement
yarn dev

# Build production
yarn build

# Démarrage production
yarn start

# Qualité
yarn lint
yarn check-types
yarn format

# Tests
yarn test
yarn test:watch
yarn coverage
```

## Ajouter une nouvelle route

Pour conserver la cohérence i18n :

1. Créer `app/[locale]/your-route/page.tsx`
2. Ajouter les chemins traduits dans `i18n/routing.ts`
3. Ajouter les clés de traduction dans `messages/*/`
4. Mettre à jour la navigation si nécessaire
5. Vérifier le rendu sur toutes les locales

## Stack technique

- **Next.js 16** (App Router + Turbopack)
- **React 19**
- **TypeScript 5.x**
- **next-intl**
- **TailwindCSS 4**
- **Three.js + React Three Fiber**
- **Vitest + Testing Library**

## Qualité et tests

Le projet inclut des tests unitaires pour composants, pages et utilitaires.

Structure de tests :

```text
__tests__/
├── components/
├── design-system/
├── pages/
├── views/
├── test-setup.tsx
└── test-utils.tsx
```

Commandes de validation recommandées :

```bash
yarn format && yarn lint && yarn check-types && yarn test && yarn coverage
```

## Documentation

- Politique bilingue : [DOCS_POLICY.md](./DOCS_POLICY.md)
- Glossaire métier FR -> EN : [docs/glossary.md](./docs/glossary.md)
- Guide agent principal : [CLAUDE.md](./CLAUDE.md)
- Guide Codex : [AGENTS.md](./AGENTS.md)
- Standards UI/code : [GUIDELINES.md](./GUIDELINES.md)
- Contributions : [CONTRIBUTING.md](./CONTRIBUTING.md)
- Sécurité : [SECURITY.md](./SECURITY.md)

## Notes sur la doc bilingue

- **Pas de mélange de langues sur une même page**
- **Technique/prompt/DevOps en anglais canonique**
- **Onboarding et présentation produit prioritairement en français**
- Maintenir les termes métier alignés avec le glossaire
