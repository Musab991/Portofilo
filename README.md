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
| `src/app/` | Next.js pages |
| `src/components/` | Header, contact form, UI |
| `src/data/portfolio.ts` | **Your content** — name, phone, projects, skills |
| `.github/workflows/` | Auto-deploy to GitHub Pages |

## Quick start (local)

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit content

Update `src/data/portfolio.ts` for name, phone, projects, skills, and links.

## Stack

Next.js 16 (static export) · TypeScript · CSS Modules · GitHub Pages · FormSubmit
