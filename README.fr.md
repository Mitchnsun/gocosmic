# Cosmic Studio Web - Application principale

L'application web principale de Cosmic Studio (anciennement Go Cosmic, toujours servie depuis `gocosmic.dev`), utilisée comme vitrine publique et plateforme business du studio. Elle sert à **présenter les réalisations de Cosmic Studio, valoriser ses applications, introduire l'équipe et promouvoir ses services web et mobile** auprès des artisans, associations et indépendants qui cherchent un site avec un accompagnement humain.

> Référence technique exhaustive (canonique EN) : [README.en.md](./README.en.md)

## Objectifs principaux

Le site Cosmic Studio a pour objectifs :

- **Vitrine portfolio** : mettre en avant les applications et projets livrés
- **Présentation du studio** : présenter la personne derrière le studio et son parcours
- **Promotion des services** : clarifier les offres pour prospects et clients
- **Identité de marque** : installer Cosmic Studio comme un studio local de confiance, avec un univers spatial discret (« Go Cosmic » reste la signature des appels à l'action)
- **Acquisition client** : transformer les visites en prises de contact qualifiées

## Fonctionnalités actuelles

### Internationalisation (i18n)

- **5 langues** : anglais, français, espagnol, allemand, italien
- **Traductions typées** : validation TypeScript des clés à la compilation
- **SEO localisé** : métadonnées et attributs `lang` par locale
- **URLs propres** : routage préfixé (`/en/`, `/fr/`, `/es/`, `/de/`, `/it/`)
- **Slugs traduits** : chemins localisés (ex. `/en/about` → `/fr/a-propos`, `/en/projects` → `/de/projekte`)
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
  │   ├── about.json         # Contenu de la page à propos
  │   ├── services.json      # Contenu de la page services & tarifs
  │   ├── pricing.json       # Colonnes de tarifs et simulateur d'abonnement
  │   ├── projects.json      # Liste des projets et études de cas
  │   ├── contact.json       # Contenu de la page contact
  │   ├── free-mockup.json   # Contenu de la page maquette gratuite
  │   ├── local.json         # Contenu de la page SEO locale
  │   ├── legal.json         # Politique de confidentialité et mentions légales
  │   └── psc-supersprint.json # Contenu de l'étude de cas PSC Supersprint
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

- **Hero** : promesse de visibilité (« Votre activité mérite d'être vue / trouvée / choisie », le dernier mot change en boucle), quatre repères (prix mensuel de départ, réponse sous 24 h, un seul interlocuteur, zone d'intervention), l'appel à l'action « Go Cosmic » vers la page maquette gratuite et un lien secondaire vers les tarifs
- **Public** : pour qui travaille le studio (artisans, associations, indépendants qui se lancent)
- **Pourquoi un studio** : quatre raisons de choisir un studio plutôt qu'un constructeur de sites
- **Déroulé** : frise en quatre étapes (rencontre, maquette, réalisation, mise en ligne)
- **Tarifs** : les deux mêmes colonnes de tarifs que sur la page Services & tarifs
- **Projets** : les trois premières cartes projet et un lien vers la liste complète
- **Applications maison** : l'application mobile du studio, Daily Fortune
- **Studio** : qui est derrière le studio et les zones desservies
- **Appel à l'action final** : lien vers la page contact et vers la maquette gratuite, sur un champ d'étoiles qui accélère au survol

### Page Services & tarifs (`/services`)

Remplace les anciennes pages services, offres et tarifs.

- **Introduction** : ce que propose le studio, un site qui tourne et quelqu'un qui s'en occupe
- **Colonnes de tarifs** : un abonnement mensuel (site, hébergement et suivi) et un projet ponctuel sur devis, avec des prix de départ indicatifs pour un espace membres, une boutique et une application mobile (montants dans `lib/pricing/offers.ts`)
- **Simulateur d'abonnement** : formule de base et options (nombre de pages, nom de domaine, hébergement en Suisse, adresse e-mail, modifications de contenu), avec un récapitulatif fixe qui affiche le total mensuel en direct ; son bouton « Demander ma maquette gratuite » transmet la simulation au formulaire de maquette gratuite, et un bloc en dessous présente les deux offres gratuites (une maquette et un état des lieux du site actuel)
- **Métiers** : quatre cartes (sites vitrine, boutiques et réservations, applications, visibilité et suivi)
- **Pour les entreprises** : les autres façons de travailler avec le studio (mission à la journée, duo développeur + designer, équipe complète), avec un lien vers la page contact
- **FAQ** : accordéon qui répond à cinq questions fréquentes (propriété du site, modification par le client, délai de mise en ligne, arrêt de l'abonnement, textes et photos)
- **Appel à l'action final** : lien vers la page contact

Les prix s'affichent en euros, ou en francs suisses pour les visiteurs situés en Suisse (détectés via l'en-tête pays de Vercel). La page d'accueil et la page à propos suivent la même règle.

### Page Projets (`/projects`)

- **Grille de projets** : une carte par projet avec son visuel, son type, son année, son client, un résumé, des étiquettes et un lien vers son étude de cas
- **Filtres** : boutons « Tous », « Site », « App web » et « App mobile » ; le nombre de projets affichés est annoncé aux lecteurs d'écran
- **Filtre partageable** : le filtre actif est conservé dans le paramètre d'URL `?type=` (`site`, `webapp` ou `mobile`), pour pouvoir partager une liste filtrée
- **Appel à l'action final** : lien vers la page contact

#### Études de cas

Les quatre études de cas partagent un même modèle : un en-tête avec l'année, le client et le type de projet, trois sections numérotées (« Pour qui », « Ce qu'on a fait », « Résultat »), un lien vers le projet en ligne accompagné d'un lien « Parler d'un projet similaire » vers la page contact, et une navigation précédent / suivant entre les études de cas.

- **Chœur des Pays du Mont Blanc** (`/projects/choeurdespaysdumontblanc`) : le site de la chorale, avec les concerts à venir, le répertoire et les informations pour rejoindre le chœur
- **PSC Supersprint** (`/projects/psc-supersprint`) : les résultats de course en direct pour un club de triathlon, avec son propre namespace de traduction
- **Daily Fortune** (`/projects/daily-fortune`) : l'application mobile du studio, publiée sur l'App Store et Google Play
- **mcomper.at** (`/projects/mcomperat`) : un CV en ligne multilingue

### Page À propos (`/about`)

- **Parcours** : le parcours de Matthieu Compérat, les zones desservies et un lien vers son profil LinkedIn
- **Pourquoi les artisans et les associations** : quatre raisons pour lesquelles le studio leur convient (être trouvé près de chez soi, un prix qui suit l'activité, quelqu'un qui répond, l'IA seulement quand elle aide)
- **Appel à l'action final** : lien vers la page contact
- **Données structurées** : une entrée JSON-LD `Person` pour les moteurs de recherche

### Page Contact (`/contact`)

- **Coordonnées** : adresses e-mail générale et support, zone d'intervention et disponibilité actuelle du studio
- **Onglet « Écrire un message »** : formulaire de contact (nom, email, téléphone, entreprise, type de besoin, message), envoyé par email via Resend
- **Onglet « Réserver un appel »** : page de réservation Google Calendar pour un appel de 20 minutes ; comme Google dépose ses propres cookies, l'agenda ne se charge qu'après un clic du visiteur, et sur écran étroit la page de réservation s'ouvre dans un nouvel onglet. L'adresse de la page vient de `NEXT_PUBLIC_GCAL_BOOKING_URL` ; sans elle, l'onglet invite à écrire un message
- **Mention de confidentialité** : lien vers la politique de confidentialité

### Page Maquette gratuite (`/free-mockup`)

Page de capture de prospects où un visiteur demande une maquette gratuite de son futur site : email, direction couleur (liste fermée de six choix), URL du site actuel et un champ libre limité à 500 caractères. Les soumissions passent par une server action qui les valide avec `zod` et les envoie par email via Resend — il n'y a pas de base de données. Un champ honeypot caché élimine silencieusement les soumissions de bots. Quand le visiteur arrive du simulateur de prix, sa simulation est jointe à la demande. Points d'entrée : le bouton du header, le hero de la page d'accueil et le simulateur de la page Services & tarifs.

### Page SEO locale (`/local`)

Page d'atterrissage locale ciblant les recherches géolocalisées (ex. `/en/web-mobile-developer-annecy-geneva`, `/fr/developpeur-web-mobile-annecy-geneve`). Elle liste les zones desservies et renvoie vers Services & tarifs, les projets et la page contact.

### Pages légales

- **Politique de confidentialité** (`/privacy`) : traitement des données personnelles, droits des visiteurs et cookies
- **Mentions légales** (`/legal-notice`) : éditeur, hébergement, propriété intellectuelle, et les déclarations sur l'usage de l'intelligence artificielle

### Page introuvable

Page 404 localisée avec des liens vers la page d'accueil et vers la page contact. Les chemins inconnus sous un préfixe de locale affichent cette page.

### Pages retirées

Les anciennes pages `/journey` (expérience 3D), `/offers` et `/pricing` n'existent plus. Elles redirigent de façon permanente (301) vers Services & tarifs dans toutes les locales, y compris depuis leurs anciens slugs localisés (voir `lib/redirects.ts` et `next.config.ts`).

### Fonctionnalités techniques

- **Performances optimales** : rendu côté serveur et optimisations automatiques
- **Architecture moderne** : Next.js 16 et React 19
- **Typage complet** : implémentation TypeScript intégrale
- **Système de composants** : primitives UI réutilisables avec documentation JSDoc

## Évolutions futures

- **Profils équipe** : pages individuelles par développeur avec compétences et expériences
- **Témoignages** : retours et succès clients
- **Blog / Articles** : insights techniques et actualités de l'équipe

## Mise en route

### Prérequis

- Node.js >= 24
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

### Variables d'environnement

Copier `.env.example` vers `.env.local` et le compléter. Les secrets serveur ne doivent jamais être préfixés par `NEXT_PUBLIC_`.

| Variable                       | Requise | Rôle                                                                                                                                                                                                                                                                                           |
| ------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`               | Oui     | Clé API Resend utilisée pour envoyer les demandes de maquette gratuite et les soumissions du formulaire de contact par email. Sans elle, le formulaire de maquette gratuite signale un échec d'envoi et le formulaire de contact journalise les soumissions localement au lieu de les envoyer. |
| `RESEND_FROM_EMAIL`            | Non     | Expéditeur de ces emails ; doit être vérifié dans le dashboard Resend. Par défaut : `Cosmic Studio <noreply@gocosmic.dev>`.                                                                                                                                                                    |
| `NEXT_PUBLIC_GCAL_BOOKING_URL` | Non     | Page de réservation Google Calendar intégrée dans l'onglet « Réserver un appel » de la page contact. Seules les URL `calendar.google.com` sont acceptées ; vide, l'onglet invite à écrire un message.                                                                                          |

### Scripts disponibles

```bash
# Développement
yarn dev

# Build production
yarn build

# Démarrage production
yarn start

# Formatage
yarn format

# Linting
yarn lint

# Vérification des types
yarn check-types

# Tests
yarn test           # Exécuter les tests unitaires
yarn test:watch     # Tests en mode watch
yarn coverage       # Rapport de couverture de tests
```

### Ajouter une nouvelle route

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
- **[TypeScript 5.9](https://www.typescriptlang.org/)** — Typage statique et développement robuste
- **[next-intl](https://next-intl.dev/)** — Internationalisation typée avec support 5 langues
- **[TailwindCSS 4.x](https://tailwindcss.com/)** — Styles avec système de design cosmique
- **[Three.js](https://threejs.org/)** — Graphiques 3D et expériences interactives
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** — Renderer React pour Three.js
- **[Heroicons](https://heroicons.com/)** — Icônes SVG artisanales
- **[Vitest](https://vitest.dev/)** — Framework de tests unitaires rapide
- **[React Testing Library](https://testing-library.com/react)** — Utilitaires de test de composants

## Qualité et tests

Le projet inclut des tests unitaires complets couvrant composants, pages et helpers. Les tests suivent une approche accessibility-first et valident la cohérence du thème cosmique.

### Structure de tests

```
__tests__/
├── components/      # Tests unitaires des composants
├── design-system/   # Tests des primitives du design system
├── pages/           # Tests des composants de pages
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
- **Pas de snapshots** : pas de tests snapshot ; on vérifie le comportement et les attributs d'accessibilité

Pour des consignes de test détaillées, voir [`__tests__/TESTING.md`](./__tests__/TESTING.md).

## Architecture

```
├── app/              # App Router (Next.js 16+)
│   ├── [locale]/     # Routes internationalisées
│   │   ├── about/    # Page à propos (parcours, pourquoi les artisans et associations, LinkedIn)
│   │   ├── contact/  # Page contact (coordonnées, formulaire, réservation d'appel)
│   │   ├── free-mockup/ # Page de demande de maquette gratuite
│   │   ├── legal-notice/ # Mentions légales (dont les déclarations sur l'usage de l'IA)
│   │   ├── local/    # Page landing SEO locale
│   │   ├── privacy/  # Politique de confidentialité
│   │   ├── projects/ # Liste filtrable des projets + études de cas (daily-fortune, mcomperat, psc-supersprint, choeurdespaysdumontblanc)
│   │   ├── services/ # Page services & tarifs (tarifs, simulateur, métiers, formats, FAQ)
│   │   ├── not-found.tsx # Page 404 localisée
│   │   └── page.tsx  # Page d'accueil
│   ├── actions/      # Server actions (formulaire de contact, demande de maquette gratuite)
│   ├── layout.tsx    # Layout racine avec provider i18n
│   └── ...
├── components/       # Composants spécifiques à l'application
│   ├── AudienceGrid/ # Cartes « pour qui »
│   ├── BookingEmbed/ # Page de réservation Google Calendar, chargée au clic
│   ├── CaseStudy/    # Modèle d'étude de cas
│   ├── ContactDetails/ # Coordonnées et disponibilité
│   ├── ContactForm/  # Formulaire de contact
│   ├── ContactPanel/ # Onglets « Écrire un message » / « Réserver un appel »
│   ├── CTAFinal/     # Appel à l'action final avec champ d'étoiles
│   ├── Faq/          # Accordéon FAQ
│   ├── Footer/       # Pied de page du site
│   ├── FreeMockupForm/ # Formulaire de demande de maquette gratuite
│   ├── Header/       # En-tête et navigation du site
│   ├── HeroSection/  # Hero de la page d'accueil
│   ├── JsonLd/       # Données structurées (JSON-LD)
│   ├── LanguageSwitcher/ # Composant de navigation multilingue
│   ├── OwnApps/      # Les applications du studio
│   ├── PricingColumns/ # Colonnes abonnement et projet ponctuel
│   ├── PricingSimulator/ # Simulateur d'abonnement avec récapitulatif fixe
│   ├── ProjectGrid/  # Cartes projet et filtres par type
│   ├── Reveal/       # Apparition au défilement
│   ├── SectionHeading/ # Surtitre, titre et chapô en tête de chaque section
│   ├── StudioIntro/  # Qui est derrière le studio
│   ├── WhyStudio/    # Raisons numérotées de choisir le studio
│   ├── WorkFormats/  # Formats pour les entreprises (mission, duo, équipe)
│   ├── ...           # Autres composants (ProcessTimeline, ServicesGrid, StatusBar, CookieConsent…)
│   └── icons/        # Icônes SVG réutilisables
├── design-system/    # Primitives UI réutilisables
│   ├── button.tsx    # Button avec variantes CVA
│   ├── pill.ts       # Styles de liens en pilule et constantes de mise en page partagées
│   ├── slider.tsx    # Slider utilisé par le simulateur de prix
│   └── lib/utils.ts  # Helper `cn` (clsx + tailwind-merge)
├── data/             # Contenu statique (liste et ordre des études de cas)
├── lib/              # Helpers partagés
│   ├── pricing/      # Montants des offres (offers.ts) et simulation transmise au formulaire de maquette gratuite
│   ├── redirects.ts  # Redirections 301 des pages retirées vers Services & tarifs
│   ├── region.ts     # Région (France ou Suisse) et devise
│   ├── resend.ts     # Client email Resend
│   └── validation/   # Schémas de validation des formulaires
├── messages/         # Fichiers de traduction organisés par namespace
│   ├── en/           # Traductions anglaises
│   │   ├── common.json        # Chaînes communes (404, meta, langue)
│   │   ├── navigation.json    # Navigation du header
│   │   ├── footer.json        # Contenu du footer
│   │   ├── home.json          # Contenu de l'accueil
│   │   ├── about.json         # Contenu à propos
│   │   ├── services.json      # Contenu services & tarifs
│   │   ├── pricing.json       # Colonnes de tarifs et simulateur
│   │   ├── projects.json      # Liste des projets et études de cas
│   │   ├── contact.json       # Contenu contact
│   │   ├── free-mockup.json   # Contenu maquette gratuite
│   │   ├── local.json         # Contenu SEO local
│   │   ├── legal.json         # Confidentialité et mentions légales
│   │   └── psc-supersprint.json # Étude de cas PSC Supersprint
│   ├── fr/           # Français (même structure)
│   ├── es/           # Espagnol (même structure)
│   ├── de/           # Allemand (même structure)
│   └── it/           # Italien (même structure)
├── i18n/             # Configuration de l'internationalisation
│   ├── routing.ts    # Routage avec chemins traduits par locale
│   ├── request.ts    # Configuration i18n côté serveur
│   ├── navigation.ts # Utilitaires de navigation côté client
│   └── canonical.ts  # Helpers d'URL canoniques
├── __tests__/        # Tests unitaires complets
│   ├── components/   # Tests composants
│   ├── i18n/         # Tests utilitaires i18n (canonical)
│   ├── lib/          # Tests des helpers
│   ├── pages/        # Tests pages
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

Notes sur la doc bilingue :

- **Pas de mélange de langues sur une même page**
- **Technique/prompt/DevOps en anglais canonique**
- **Onboarding et présentation produit prioritairement en français**
- Maintenir les termes métier alignés avec le glossaire
