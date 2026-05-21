# Go Cosmic Web - Application principale

L'application web principale de l'écosystème Go Cosmic, utilisée comme vitrine publique et plateforme business de l'équipe. Elle sert à **présenter les réalisations de Go Cosmic, valoriser leurs applications, introduire l'équipe et promouvoir leurs services de développement** auprès des prospects et collaborateurs.

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
- **Traductions typées** : validation TypeScript des clés à la compilation
- **SEO localisé** : métadonnées et attributs `lang` par locale
- **URLs propres** : routage préfixé (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Slugs traduits** : chemins localisés (ex. `/en/about` → `/fr/a-propos`, `/en/journey` → `/de/reise`)
- **Détection navigateur** : locale automatique selon préférences utilisateur
- **Language switcher** : menu de changement de langue avec indication visuelle
- **Organisation par namespace** : fichiers de traduction organisés par espace de noms pour une meilleure maintenabilité

#### Structure des fichiers de traduction

Les traductions sont organisées en fichiers par namespace pour une meilleure lisibilité et maintenabilité :

```
messages/
  ├── en/              # Traductions anglaises
  │   ├── common.json        # Chaînes partagées (404, meta, sélecteur de langue)
  │   ├── navigation.json    # Labels de navigation du header
  │   ├── footer.json        # Contenu du footer
  │   ├── home.json          # Contenu de la page d'accueil
  │   ├── about.json         # Contenu de la page about
  │   ├── services.json      # Contenu de la page services
  │   ├── offers.json        # Contenu de la page offres
  │   ├── journey.json       # Contenu de la page journey
  │   ├── projects.json      # Contenu des pages projets
  │   ├── contact.json       # Contenu de la page contact
  │   ├── local.json         # Contenu de la page SEO locale
  │   └── psc-supersprint.json # Contenu du projet PSC Supersprint
  ├── fr/              # Français (même structure)
  ├── es/              # Espagnol (même structure)
  ├── de/              # Allemand (même structure)
  └── it/              # Italien (même structure)
```

**Avantages de l'organisation par namespace :**

- **Meilleure maintenabilité** : chaque namespace est autonome et plus facile à gérer
- **Scalabilité** : ajouter une page ne nécessite que la création ou mise à jour d'un fichier de namespace spécifique
- **Séparation claire** : les composants partagés (navigation, footer) ont leurs propres namespaces
- **Collaboration facilitée** : plusieurs développeurs peuvent travailler sur des namespaces différents sans conflits
- **Chargement optimisé** : seuls les namespaces nécessaires sont chargés par route

**Chargement dynamique :**

L'application utilise un chargement intelligent à la demande :

- Les **namespaces partagés** (`common`, `navigation`, `footer`) sont chargés sur toutes les pages
- Les **namespaces spécifiques** ne sont chargés que pour la route correspondante
- Cela réduit la taille du bundle et améliore les temps de chargement initiaux

**Utilisation dans les composants :**

Les composants utilisent le hook `useTranslations` avec le namespace approprié :

```tsx
import { useTranslations } from 'next-intl';

// Dans un composant de page
export default function HomePage() {
  const t = useTranslations('homepage');
  return <h1>{t('hero.title')}</h1>;
}

// Dans un composant partagé
export default function Header() {
  const t = useTranslations('navigation');
  return <nav>{t('label')}</nav>;
}
```

### Page d'accueil

- **Hero Section** : introduction percutante avec le branding « Go Cosmic » et un appel à l'action
- **Bouton interactif** : démonstration des composants UI
- **Lien équipe** : accès direct à la présentation de l'équipe
- **Design cosmique** : univers spatial avec composants UI célestes
- **Responsive** : optimisé pour tous les formats d'écran
- **Contenu multilingue** : tous les textes traduits dans les 5 langues

### Page Journey (`/journey`)

- **Expérience 3D cosmique** : champ d'étoiles interactif avec Three.js et React Three Fiber
- **Chargement dynamique** : imports dynamiques Next.js pour des performances optimales
- **Animation immersive** : plus de 2 000 étoiles animées avec une physique réaliste
- **État de chargement** : transition fluide avec un spinner cosmique
- **Optimisation SSR** : rendu côté client pour éviter les problèmes WebGL serveur

### Page About (`/about`)

- **Présentation** : mission et domaines d'expertise de Go Cosmic
- **Profil développeur** : mise en avant de l'expertise et de l'expérience de Matthieu Compérat
- **Mentions légales et usage IA** : déclarations transparentes sur l'IA, la confidentialité et les responsabilités
- **Accessibilité** : titres sémantiques, aria-labels descriptifs et styles de focus clavier
- **SEO** : métadonnées et descriptions Open Graph optimisées

### Page Services (`/services`)

- **Développement Stellar** : expertise web moderne avec des technologies de pointe
- **Design UI/UX Mystical** : approche design immersive, accessible et orientée conversion
- **Solutions propulsées par l'IA** : fonctionnalités intelligentes exploitant l'IA moderne
- **Lancement Cosmic** : accompagnement complet du développement à la mise en production

### Page Offres (`/offers`)

- **Solo Cosmic Developer** : développeur dédié pour startups et petits projets
- **Complete Cosmic Team** : solutions full-stack pour projets complexes à grande échelle
- **Developer + Designer Duo** : excellence technique et design de qualité combinés

### Page Contact (`/contact`)

Formulaire de contact professionnel pour les demandes clients et consultations.

### Page SEO locale (`/local`)

Page d'atterrissage locale ciblant les recherches géolocalisées (ex. `/en/web-mobile-developer-annecy-geneva`, `/fr/developpeur-web-mobile-annecy-geneve`).

### Section Projets

#### Daily Fortune (`/projects/daily-fortune`)

- **Vitrine projet** : présentation complète de l'application mobile Daily Fortune
- **Fonctionnalités** : fortunes quotidiennes, contenus motivants et design cosmique
- **Stack technique** : Next.js, TypeScript, React Native, TailwindCSS
- **Intégration IA** : génération de fortunes propulsée par l'IA
- **Support multilingue** : traductions complètes dans les 5 langues
- **Appel à l'action** : lien vers le dépôt du projet

#### mcomperat (`/projects/mcomperat`)

Vitrine du portfolio personnel du développeur.

#### PSC Supersprint (`/projects/psc-supersprint`)

Vitrine du projet PSC Supersprint avec namespace de traduction dédié.

#### Choeur des Pays du Mont Blanc (`/projects/choeurdespaysdumontblanc`)

Vitrine du projet Choeur des Pays du Mont Blanc.

### Fonctionnalités techniques

- **Performances optimales** : rendu côté serveur et optimisations automatiques
- **Architecture moderne** : Next.js 16 et React 19
- **Typage complet** : implémentation TypeScript intégrale
- **Système de composants** : primitives UI réutilisables avec documentation JSDoc

## Évolutions futures

- **Profils équipe** : pages individuelles par développeur avec compétences et expériences
- **Études de cas** : présentation approfondie de projets clients réussis
- **Témoignages** : retours et succès clients
- **Blog / Articles** : insights techniques et actualités de l'équipe

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

### Scripts disponibles

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
yarn test           # Exécuter les tests unitaires
yarn test:watch     # Tests en mode watch
yarn coverage       # Rapport de couverture de tests
```

## Ajouter une nouvelle route

Pour conserver la cohérence i18n :

1. **Créer la route** : ajouter le composant de page dans `app/[locale]/your-route/page.tsx`

2. **Configurer les chemins traduits** : mettre à jour `i18n/routing.ts` :

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

3. **Ajouter les traductions** : inclure les nouvelles clés dans tous les fichiers de messages (`messages/`)

4. **Mettre à jour la navigation** : si la route nécessite des liens, les ajouter aux composants de navigation concernés

5. **Tester sur toutes les locales** : vérifier le bon fonctionnement dans les 5 langues

Cette approche garantit des URLs SEO-friendly et une expérience utilisateur cohérente dans toutes les langues supportées.

## Stack technique

- **[Next.js 16](https://nextjs.org/)** — Framework React avec App Router et Turbopack
- **[React 19](https://react.dev/)** — Dernière version React avec Server Components
- **[TypeScript 5.8](https://www.typescriptlang.org/)** — Typage statique et développement robuste
- **[next-intl](https://next-intl.dev/)** — Internationalisation typée avec support 5 langues
- **[TailwindCSS 4.x](https://tailwindcss.com/)** — Styles avec système de design cosmique
- **[Three.js](https://threejs.org/)** — Graphiques 3D et expériences interactives
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** — Renderer React pour Three.js
- **[Heroicons](https://heroicons.com/)** — Icônes SVG artisanales
- **[Vitest](https://vitest.dev/)** — Framework de tests unitaires rapide
- **[React Testing Library](https://testing-library.com/react)** — Utilitaires de test de composants

## Qualité et tests

Le projet inclut des tests unitaires complets couvrant composants, pages et vues. Les tests suivent une approche accessibility-first et valident la cohérence du thème cosmique.

### Structure de tests

```
__tests__/
├── components/      # Tests unitaires des composants
├── design-system/   # Tests des primitives du design system
├── pages/           # Tests des composants de pages
├── views/           # Tests des composants de vues
├── test-setup.tsx   # Configuration globale des tests
└── test-utils.tsx   # Utilitaires de rendu avec contexte i18n
```

### Utilitaires de test avec internationalisation

Le fichier `test-utils.tsx` fournit une fonction `render` personnalisée incluant le contexte next-intl pour les composants utilisant des traductions :

```tsx
import { render } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

// Import des fichiers de namespace
import common from '../messages/en/common.json';
import navigation from '../messages/en/navigation.json';
import footer from '../messages/en/footer.json';
// ... autres namespaces

// Fusion des namespaces
const messages = {
  ...common,
  ...navigation,
  ...footer,
  // ... autres namespaces
};

// Rendu personnalisé avec contexte i18n
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

### Mock de la navigation

Pour les composants utilisant les hooks de navigation Next.js, des mocks globaux sont configurés :

```tsx
// Mock de next/navigation pour les tests
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => '/en',
}));
```

### Bonnes pratiques

- **Tests orientés comportement** : les tests valident l'expérience utilisateur, pas les détails d'implémentation
- **Validation accessibilité** : tous les tests vérifient les attributs ARIA et la structure sémantique
- **Validation du thème cosmique** : les tests assurent la cohérence du style spatial
- **Tests i18n** : les composants utilisant des traductions sont testés avec le contexte approprié
- **Stratégie de mock** : les dépendances externes sont correctement mockées
- **Pas de snapshots** : les snapshots sont déconseillés pour les composants, tolérés pour les pages/vues uniquement

Commandes de validation recommandées avant commit :

```bash
yarn format && yarn lint && yarn check-types && yarn test && yarn coverage
```

## Architecture

```
├── app/              # App Router (Next.js 16+)
│   ├── [locale]/     # Routes internationalisées
│   │   ├── about/    # Page about (mission, profil, mentions légales et IA)
│   │   ├── contact/  # Page contact
│   │   ├── journey/  # Page expérience 3D cosmique
│   │   ├── local/    # Page landing SEO locale
│   │   ├── offers/   # Page offres (solo, équipe, duo)
│   │   ├── projects/ # Index projets + sous-pages (daily-fortune, mcomperat, psc-supersprint, choeurdespaysdumontblanc)
│   │   ├── services/ # Page services (développement, design, IA, lancement)
│   │   └── page.tsx  # Page d'accueil
│   ├── layout.tsx    # Layout racine avec provider i18n
│   └── ...
├── components/       # Composants spécifiques à l'application
│   ├── Footer/       # Pied de page du site
│   ├── Header/       # En-tête et navigation du site
│   ├── Journey/      # Enveloppe canvas 3D
│   ├── JsonLd/       # Données structurées (JSON-LD)
│   ├── LanguageSwitcher/ # Composant de navigation multilingue
│   ├── Loader/       # États de chargement
│   └── icons/        # Icônes SVG réutilisables
├── design-system/    # Primitives UI réutilisables (Button avec variantes CVA)
├── messages/         # Fichiers de traduction organisés par namespace
│   ├── en/           # Traductions anglaises
│   │   ├── common.json        # Chaînes communes (404, meta, langue)
│   │   ├── navigation.json    # Navigation du header
│   │   ├── footer.json        # Contenu du footer
│   │   ├── home.json          # Contenu de l'accueil
│   │   ├── about.json         # Contenu about
│   │   ├── services.json      # Contenu services
│   │   ├── offers.json        # Contenu offres
│   │   ├── journey.json       # Contenu journey
│   │   ├── projects.json      # Contenu pages projets
│   │   ├── contact.json       # Contenu contact
│   │   ├── local.json         # Contenu SEO local
│   │   └── psc-supersprint.json # Projet PSC Supersprint
│   ├── fr/           # Français (même structure)
│   ├── es/           # Espagnol (même structure)
│   ├── de/           # Allemand (même structure)
│   └── it/           # Italien (même structure)
├── i18n/             # Configuration de l'internationalisation
│   ├── routing.ts    # Routage avec chemins traduits par locale
│   ├── request.ts    # Configuration i18n côté serveur
│   ├── navigation.ts # Utilitaires de navigation côté client
│   └── canonical.ts  # Helpers d'URL canoniques
├── views/            # Composants de vue (ex. contenu Journey)
├── __tests__/        # Tests unitaires complets
│   ├── components/   # Tests composants
│   ├── i18n/         # Tests utilitaires i18n (canonical)
│   ├── pages/        # Tests pages
│   ├── views/        # Tests vues
│   ├── proxy.test.ts # Tests middleware/proxy
│   └── test-utils.tsx # Rendu personnalisé avec contexte i18n
├── proxy.ts          # Middleware de détection de locale et routage
├── public/           # Assets statiques et icônes
└── ...
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
