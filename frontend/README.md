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

All shadcn/ui components have been downloaded under `@/components/ui`.

## File Structure

- `index.html` - HTML entry point
- `vite.config.ts` - Vite configuration file
- `tailwind.config.ts` - Tailwind CSS configuration file
- `package.json` - NPM dependencies and scripts
- `src/main.tsx` - Project entry point
- `src/App.tsx` - Router shell (imports pages and sets up routes)
- `src/pages/Index.tsx` - Main page entry point for `/` by default; replace the placeholder page here unless you explicitly reroute `/` elsewhere
- `src/index.css` - Existing CSS configuration

## Components

- All shadcn/ui components are pre-downloaded and available at `@/components/ui`

## Styling

- Add global styles to `src/index.css` or create new CSS files as needed
- Use Tailwind classes for styling components

## Development

- Import components from `@/components/ui` in your React components
- Customize the UI by modifying the Tailwind configuration
- Do not stop after editing isolated components or only `src/App.tsx`. The default template homepage lives in `src/pages/Index.tsx`, and leaving `Welcome to Atoms` there means the app is still unfinished.
- Completion check: either replace `src/pages/Index.tsx` with your real homepage, or update the `/` route in `src/App.tsx` so the live homepage no longer renders the default placeholder page.

## Note

- The `@/` path alias points to the `src/` directory
- Do NOT modify the title, description, and logo in `index.html` — they are managed by the overview system via `data-mgx-overview` markers.

# Commands

**Install Dependencies**

```shell
pnpm i
```

**Start Preview**

```shell
pnpm run dev
```

**To build**

```shell
pnpm run build
```
