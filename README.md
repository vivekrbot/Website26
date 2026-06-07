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

All content lives in `src/data/` — edit these files to update the site without touching components:

| File | What it controls |
|---|---|
| `src/data/about.ts` | Bio, skills, values, quick-facts |
| `src/data/projects.ts` | Projects / case studies |
| `src/data/mentorship.ts` | Mentorship tiers and copy |
| `src/data/navigation.ts` | Nav links and social links |

### Adding a project

In `src/data/projects.ts`, add an object to the `projects` array:

```ts
{
  slug: 'my-new-project',       // used in the URL: /works/my-new-project
  title: 'Project Title',
  tagline: 'One-line description shown on cards.',
  category: 'Product Design',   // used for filtering
  tags: ['Tag 1', 'Tag 2'],
  year: 2025,
  coverImage: '',               // add a path to an image in public/
  featured: true,               // show on the home page snippet
  role: 'Lead Product Designer',
  problem: 'What problem were you solving?',
  process: ['Step 1', 'Step 2', 'Step 3'],
  outcome: 'What did you ship and what happened?',
  links: [{ label: 'Live Site', url: 'https://...' }],
}
```

### Replacing placeholders

Search the codebase for these markers and swap in real content:

- `[YOUR-GITHUB-USERNAME]` — your GitHub handle
- `[YOUR CITY]` — your location
- `[X]+ years` — your years of experience
- `[YOUR BACKGROUND]` — e.g., "Started as a software engineer"
- `[PRICE PLACEHOLDER]` — your mentorship pricing
- `coverImage: ''` — add a path/URL to each project's cover image

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
├── data/            Typed content config files — edit these for content
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
```

---

## Tech Stack

- **React 19** + **Vite 6** + **TypeScript**
- **React Router v6** — client-side routing with `createBrowserRouter`
- **Framer Motion** — UI and route transitions
- **Canvas 2D** — space background (no WebGL overhead)
- **CSS Modules** + **CSS custom properties** — scoped styles + design tokens
- **react-helmet-async** — per-route SEO meta tags
- **GitHub Actions** → **GitHub Pages** — CI/CD

---

## License

MIT — feel free to fork and adapt for your own portfolio.
