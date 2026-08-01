# EGD Atlas

EGD Atlas est une application de cartographie territoriale pensée pour la République démocratique du Congo. Elle permet d’explorer des cartes interactives, gérer des couches thématiques, générer des atlas et exporter des livrables cartographiques.

## Objectif du projet

Cette plateforme sert de vitrine fonctionnelle pour le pilotage de données géospatiales, la visualisation territoriale et la génération de cartes de synthèse.

## Stack technique

- React 19
- TypeScript
- Vite 8
- Tailwind CSS
- Chakra UI
- React Leaflet
- Recharts

## Fonctionnalités principales

- Tableau de bord de synthèse
- Carte interactive avec filtres et thèmes
- Génération de cartes et d’exports
- Recherche de lieux et d’infrastructures
- Historique des actions et catalogue de données

## Scripts disponibles

- `npm run dev` : lance le serveur de développement
- `npm run build` : construit la version de production
- `npm run lint` : contrôle la qualité du code

## Déploiement GitLab Pages

Le dépôt est prêt pour un hébergement statique sur GitLab Pages.

### Pré-requis

- un projet GitLab existant
- un dépôt associé au remote GitLab
- un runner GitLab capable d’exécuter Node.js

### Build local

```bash
npm install
npm run build
```

### Publication

L’intégration CI est fournie via le fichier [.gitlab-ci.yml](.gitlab-ci.yml).

Pour publier sur GitLab Pages :

1. pousser le dépôt sur le remote GitLab
2. activer GitLab Pages sur le projet
3. vérifier la branche cible configurée pour le pipeline

### Structure du dépôt

- [src/App.tsx](src/App.tsx) : point d’entrée de l’application
- [src/pages](src/pages) : écrans et vues métier
- [src/components](src/components) : composants UI et layout
- [src/data/mockData.ts](src/data/mockData.ts) : données de démonstration
- [public](public) : fichiers statiques SEO et assets de publication

## Licence

Projet interne d’exploitation et de démonstration cartographique.
