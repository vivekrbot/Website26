# Vivek Ramachandran — Portfolio

Personal portfolio website built with React, Vite, TypeScript, Framer Motion, and CSS Modules. Features a deep-space theme with animated starfield, asteroid particles, cursor gravity, and full dark/light mode support.

**Live URL:** `https://[YOUR-GITHUB-USERNAME].github.io/Website26/`

---

## Local Development

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173/Website26/`

## Build

```bash
npm run build
```

Output goes to `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Deployment (GitHub Pages)

### First-time setup

1. Create a GitHub repo named `Website26` (or your preferred name).
2. Push this folder to `main`:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/[YOUR-GITHUB-USERNAME]/Website26.git
   git push -u origin main
   ```
3. In your GitHub repo: **Settings → Pages → Source → GitHub Actions**.
4. Push triggers the workflow at `.github/workflows/deploy.yml` automatically.
5. Your site will be live at `https://[YOUR-GITHUB-USERNAME].github.io/Website26/`

### If your repo name is different

Update `base` in `vite.config.ts`:
```ts
base: '/YOUR-REPO-NAME/',
```
And update the `segmentCount` variable in `public/404.html` (keep it at `1` for a single-segment path like `/Website26/`).

---

## Customizing Content

Content is managed in **Sanity** and pulled into `src/data/*.ts` at build time — you don't hand-edit those files directly (they're overwritten on every `npm run dev` / `npm run build`).

### One-time setup

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage) and note the **Project ID** and **dataset** (default `production`).
2. In the repo root, copy `.env.local.example` to `.env.local` and fill in `SANITY_PROJECT_ID` / `SANITY_DATASET`.
3. In `studio/`, copy `.env.example` to `.env` with the same values, then:
   ```bash
   cd studio
   npm install
   npm run dev        # Studio at http://localhost:3333
   ```
4. (Optional, one-time) Migrate the existing bio/mentorship/nav content into Sanity instead of retyping it:
   ```bash
   SANITY_API_TOKEN=<write-token-from-manage.sanity.io> npm run seed:sanity
   ```

### Day to day

- Edit content in Sanity Studio (`studio/`, or your deployed `https://<project>.sanity.studio` after `npm run deploy` inside `studio/`).
- Back in the main app, `npm run dev` / `npm run build` automatically re-fetch content (see `scripts/fetch-content.mjs`) before starting — no manual export/copy step.
- In CI, the deploy workflow (`.github/workflows/deploy.yml`) reads `SANITY_PROJECT_ID` / `SANITY_DATASET` from repo variables (**Settings → Secrets and variables → Actions → Variables**). Optionally wire a Sanity webhook on publish to `POST https://api.github.com/repos/<owner>/<repo>/dispatches` with `{ "event_type": "content-published" }` so publishing content redeploys the site automatically.

Content types (see `studio/schemaTypes/`): **Project** (case studies — add real ones here, the shipped defaults are placeholders), **About** (singleton: bio, skills, values, quick facts), **Mentorship tier**, **Navigation** (singleton: nav links, social links).

### Adding a real avatar photo

In `src/pages/About/About.tsx`, replace the `avatarPlaceholder` div with:
```tsx
<img
  src="/your-photo.jpg"
  alt="Vivek Ramachandran"
  className={styles.avatar}
/>
```
Add the image to `public/` and add a `.avatar` class in `About.module.css` with the same dimensions as `.avatarPlaceholder`.

---

## Design Tokens

All design tokens (colors, spacing, typography, motion) are defined as CSS custom properties in `src/styles/tokens.css`. Dark/light theme switching works by toggling `data-theme="light"` on `<html>` — no JavaScript is needed for the token values themselves.

### Changing the accent color

In `tokens.css`, update:
```css
--accent-primary:   #your-color;
--accent-secondary: #your-secondary;
--accent-highlight: #your-highlight;
```

---

## Space Canvas

The animated background (`src/canvas/SpaceCanvas.tsx`) is a vanilla Canvas 2D animation — no WebGL or heavy library. It:

- Renders 120 twinkling stars across 3 parallax layers
- Renders 10 asteroid polygons that drift and react to cursor position (gravity effect)
- Pauses automatically when the tab is hidden (`visibilitychange`)
- Respects `prefers-reduced-motion` (draws once statically)
- Adapts to dark/light theme

Tune constants at the top of the file:
```ts
const STAR_COUNT      = 120;
const ASTEROID_COUNT  = 10;
const GRAVITY_RADIUS  = 180;  // px
const GRAVITY_FORCE   = 0.018;
const ASTEROID_SPEED  = 0.12;
```

---

## Project Structure

```
src/
├── canvas/          SpaceCanvas animation
├── components/      Reusable UI atoms (Button, SectionHeader, ThemeToggle, SkipLink)
├── data/            Content, generated from Sanity at build time — do not edit by hand
├── hooks/           useTheme, useReducedMotion, useScrollSpy
├── layout/          Layout shell, Nav, Footer
├── pages/           Route-level page components (lazy-loaded)
│   ├── Home/
│   ├── About/
│   ├── Works/
│   ├── WorkDetail/
│   └── Mentorship/
├── sections/        Home-only section summary components
│   ├── Hero/
│   ├── AboutSnippet/
│   ├── WorksSnippet/
│   └── MentorshipSnippet/
├── styles/          tokens.css, reset.css, global.css
├── types/           Shared TypeScript interfaces
├── router.tsx       React Router config
└── main.tsx         Entry point

scripts/
├── fetch-content.mjs   Pulls content from Sanity into src/data/*.ts (predev/prebuild)
└── seed-sanity.mjs     One-time migration of existing content into Sanity

studio/               Independent Sanity Studio project (own package.json) — the CMS UI
```

---

## Tech Stack

- **React 19** + **Vite 6** + **TypeScript**
- **React Router v6** — client-side routing with `createBrowserRouter`
- **Framer Motion** — UI and route transitions
- **Canvas 2D** — space background (no WebGL overhead)
- **CSS Modules** + **CSS custom properties** — scoped styles + design tokens
- **react-helmet-async** — per-route SEO meta tags
- **Sanity** — headless CMS; content fetched at build time, no runtime dependency
- **GitHub Actions** → **GitHub Pages** — CI/CD

---

## License

MIT — feel free to fork and adapt for your own portfolio.
