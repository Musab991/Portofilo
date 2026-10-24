# Musab Atieh — Portfolio

Freelance ASP.NET Core & SQL backend developer portfolio.

**Live site:** [musabatieh.com](https://musabatieh.com)

## Deploy — GitHub Pages

This repo publishes automatically when you push to `main`:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

GitHub Actions builds the static site and deploys to Pages.  
Setup guide: [docs/domain-setup.md](docs/domain-setup.md)

## Folder structure

| Folder | Purpose |
| --- | --- |
| `public/` | Photos, project screenshots, `CNAME` for custom domain |
| `content/workshops/` | **Workshop pages** — one Markdown file per level (see [docs/ADDING-A-WORKSHOP.md](docs/ADDING-A-WORKSHOP.md)) |
| `src/app/(site)/` | English pages: home, projects, CV, contact |
| `src/app/(workshops)/` | Arabic RTL workshop pages, built from `content/workshops/` |
| `src/styles/tokens.css` | Colors, spacing, fonts (design tokens) — the only place colors are defined |
| `src/components/` | Header, footer, contact form, workshop UI |
| `src/data/portfolio.ts` | **Your content** — name, contact links (Telegram/email), projects, skills, CV |
| `.github/workflows/` | Auto-deploy to GitHub Pages |

## Quick start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

- Portfolio, CV, projects: `src/data/portfolio.ts`
- Workshops: `content/workshops/*.md` (guide: `docs/ADDING-A-WORKSHOP.md`)

## Stack

Next.js 16 (static export) · TypeScript · CSS Modules · GitHub Pages · FormSubmit
