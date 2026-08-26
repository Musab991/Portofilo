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
├── docs/                     ← setup guides (optional on deploy)
├── package.json
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

- Vercel: https://freelance-portfolio-lyart-one.vercel.app
- Custom domain: musabatieh.com (via CNAME)
