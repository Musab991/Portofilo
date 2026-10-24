# Repository folder structure

Upload or push the **project root** — not a parent folder wrapping the project.

```
Portofilo/                    ← repo root (what GitHub shows)
├── content/workshops/        ← one .md file per workshop level (Arabic)
├── public/                   ← images & static files
│   ├── musab-atieh.png
│   └── projects/avl/         ← case study screenshots
├── src/
│   ├── app/
│   │   ├── (site)/           ← English pages: /, /projects, /cv, /contact
│   │   └── (workshops)/      ← Arabic RTL pages: /workshops, /workshops/<slug>
│   ├── components/           ← React UI
│   ├── lib/workshops.ts      ← reads content/workshops at build time
│   ├── styles/tokens.css     ← colors & spacing (design tokens)
│   └── data/
│       └── portfolio.ts      ← edit your name, projects, links, CV here
├── .github/workflows/   ← auto-deploy to GitHub Pages on push
├── next.config.ts
└── README.md
```

## Do not upload to GitHub

These stay local only (already in `.gitignore`):

- `node_modules/`
- `.next/`
- `out/`
- `.env*` (secrets)

## Edit content

Change **`src/data/portfolio.ts`** for name, contact links (Telegram/email), projects, skills, and links.

## Live site

- https://musabatieh.com (custom domain via GitHub Pages)
- https://musab991.github.io/Portofilo/ (project URL backup)
