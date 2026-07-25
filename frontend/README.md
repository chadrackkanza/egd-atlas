# Documentation du projet EGAtlas

## Présentation

EGD Atlas est une application web moderne développée avec React, TypeScript et Vite. Elle permet de visualiser et d’explorer une carte thématique autour de différentes données géographiques, avec des fonctionnalités de sélection de zone, de gestion des couches, d’export et de consultation de statistiques.

Le projet est organisé comme une interface frontale complète, avec un serveur mock API local pour faciliter le développement sans dépendre immédiatement d’un backend externe.

## Stack technique

- React 18
- TypeScript
- Vite 5
- React Router DOM
- Tailwind CSS
- shadcn/ui
- React Query
- Leaflet / React Leaflet
- Fastify (serveur mock API)

## Prérequis

Avant de lancer le projet, assurez-vous d’avoir installé :

- Node.js 18 ou supérieur
- npm ou pnpm

## Installation

Depuis le dossier du frontend :

```bash
cd frontend
npm install
```

Si vous préférez pnpm :

```bash
cd frontend
pnpm install
```

## Démarrage du projet

### Mode développement

```bash
npm run dev
```

Cette commande lance automatiquement :

- le serveur mock API sur http://localhost:8000
- le serveur Vite sur http://localhost:3000

Vous pouvez ensuite ouvrir :

```text
http://localhost:3000
```

## Scripts disponibles

- `npm run dev` : démarre le workflow complet de développement (mock API + Vite)
- `npm run dev:vite` : démarre uniquement Vite
- `npm run mock:server` : démarre uniquement le serveur mock API
- `npm run build` : construit l’application pour la production
- `npm run preview` : prévisualise la version buildée
- `npm run lint` : exécute ESLint sur le code source

## Structure du projet

```text
frontend/
├── public/                # Fichiers statiques
├── server/                # Serveur mock API Fastify
├── src/
│   ├── components/        # Composants React réutilisables
│   │   └── atlas/         # Composants spécifiques à l’interface atlas
│   ├── hooks/             # Hooks personnalisés
│   ├── lib/               # Logique API, configuration, utilitaires
│   ├── pages/             # Pages de l’application
│   ├── App.tsx            # Configuration des routes principales
│   └── main.tsx           # Point d’entrée React
├── vite.config.ts         # Configuration Vite et proxy API
└── package.json           # Dépendances et scripts
```

## Fonctionnalités principales

- Sélection de zone géographique : province, territoire, quartier
- Choix de thème cartographique : éducation, santé, eau, etc.
- Gestion des couches cartographiques
- Visualisation de carte interactive
- Panneau d’export de carte
- Panneau de statistiques
- Navigation entre les différentes pages de l’application
- Support d’alertes et de notifications utilisateur

## Architecture frontale

### Routage

Les routes principales sont définies dans [src/App.tsx](src/App.tsx) et couvrent notamment :

- `/` : page d’accueil / atlas principal
- `/generate` : génération de carte
- `/atlas` : modèles atlas
- `/data` : catalogue de données
- `/analytics` : analyses
- `/exports` : exports personnels
- `/history` : historique des actions
- `/settings` : paramètres utilisateur
- `/help` : centre d’aide

### Communication API

Les appels API sont centralisés dans [src/lib/backend.ts](src/lib/backend.ts) et utilisent les endpoints `/api/*`.

Le proxy Vite est configuré dans [vite.config.ts](vite.config.ts) pour rediriger les requêtes API vers le backend local sur le port 8000.

### Configuration runtime

La configuration dynamique est gérée dans [src/lib/config.ts](src/lib/config.ts). Elle permet de charger des valeurs de configuration selon l’environnement d’exécution.

## Serveur mock API

Le projet embarque un serveur mock API dans [server/index.mjs](server/index.mjs) afin de permettre un développement local fiable sans dépendre immédiatement d’un backend externe.

Les endpoints disponibles incluent :

- `GET /api/stats`
- `GET /api/history`
- `GET /api/exports`
- `POST /api/exports`
- `POST /api/client-log`

## Bonnes pratiques de développement

- Conserver la logique métier dans les fichiers du dossier `src/lib`
- Utiliser les composants du dossier `src/components` pour la UI réutilisable
- Préférer les hooks personnalisés pour la logique récurrente
- Garder les appels réseau centralisés dans les modules dédiés
- Vérifier les erreurs de proxy si les appels `/api/*` échouent en développement

## Dépannage

### Les appels API échouent

Vérifiez que :

1. `npm run dev` est bien lancé
2. le serveur mock API est bien actif sur le port 8000
3. aucune autre application n’utilise les ports 3000 ou 8000

### Le site ne s’affiche pas

Vérifiez que :

- les dépendances ont bien été installées
- le terminal affiche bien les messages de démarrage de Vite
- le navigateur ouvre l’URL correcte : http://localhost:3000

## Contribution

Pour contribuer au projet :

1. Créer une branche de travail
2. Appliquer les modifications
3. Tester localement avec `npm run dev`
4. Vérifier que le build passe avec `npm run build`
