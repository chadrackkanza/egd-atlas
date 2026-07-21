# Shadcn-UI Template Usage Instructions

## technology stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
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

## Deploy To GitHub Pages

This frontend can be deployed from GitHub Actions with GitHub Pages.

1. Push the repository to GitHub.
2. In GitHub, open `Settings > Pages` and set `Source` to `GitHub Actions`.
3. Optionally define the repository variable `VITE_API_BASE_URL` if the frontend should call an external API in production.
4. The workflow at `.github/workflows/deploy-frontend-gh-pages.yml` will build from `frontend/` and publish `frontend/dist`.

Notes:

- The Vite `base` path is computed from the GitHub repository name during CI, so project pages such as `https://user.github.io/repo/` work without manual edits.
- The build also emits `404.html` and `.nojekyll` so React Router routes keep working after a refresh on GitHub Pages.

## Deploy To Vercel

The repository root now includes a `vercel.json` that builds the `frontend/` app and serves `frontend/dist`.
There is also a `frontend/vercel.json` if you prefer setting Vercel's `Root Directory` to `frontend`.

- If you import the whole repository into Vercel, the build uses `cd frontend && npm ci` and `cd frontend && npm run build`.
- If you set `Root Directory` to `frontend`, Vercel can use the local `frontend/vercel.json` and the default Vite build flow.
- For production API calls, define `VITE_API_BASE_URL` in the Vercel project environment variables if your API is external.
- The Vercel rewrite sends SPA routes to `/index.html`, which is required for `react-router-dom` with `BrowserRouter`.
