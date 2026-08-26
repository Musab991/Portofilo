# Repository folder structure

Upload or push the **project root** — not a parent folder wrapping the project.

```
Portofilo/                    ← repo root (what GitHub shows)
├── public/                   ← images & static files
│   ├── musab-atieh.png
│   └── projects/avl/         ← case study screenshots
├── src/
│   ├── app/                  ← pages + API routes
│   │   └── api/contact/      ← contact form backend
│   ├── components/           ← React UI
│   └── data/
│       └── portfolio.ts      ← edit your name, projects, links here
├── .github/workflows/   ← auto-deploy to GitHub Pages on push
├── next.config.ts
└── README.md
```

## Do not upload to GitHub

These stay local only (already in `.gitignore`):

- `node_modules/`
- `.next/`
- `.vercel/`
- `.env*` (secrets)

## Edit content

Change **`src/data/portfolio.ts`** for name, phone, projects, skills, and links.

## Live site

- https://musabatieh.com (custom domain via GitHub Pages)
- https://musab991.github.io/Portofilo/ (project URL backup)
