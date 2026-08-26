# Musab Atieh — Portfolio

Freelance ASP.NET Core & SQL backend developer portfolio.

**Live site:** [freelance-portfolio-lyart-one.vercel.app](https://freelance-portfolio-lyart-one.vercel.app) · [musabatieh.com](https://musabatieh.com)

## Folder structure

| Folder | Purpose |
| --- | --- |
| `public/` | Photos, project screenshots, static assets |
| `src/app/` | Next.js pages and `/api/contact` |
| `src/components/` | Header, contact form, UI |
| `src/data/portfolio.ts` | **Your content** — name, phone, projects, skills |
| `docs/` | Setup guides |

See [docs/repo-structure.md](docs/repo-structure.md) for full layout.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Connected to **Vercel**. Push to `main` to trigger a new deploy:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

Or redeploy from the [Vercel dashboard](https://vercel.com/lords5/freelance-portfolio).

## Contact form email

See [docs/contact-setup.md](docs/contact-setup.md) for Gmail App Password setup on Vercel.

## Stack

Next.js 16 · TypeScript · CSS Modules · Nodemailer · Vercel
