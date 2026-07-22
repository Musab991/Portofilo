# Freelance portfolio

Single-page Next.js portfolio for Upwork / Freelancer.com positioning.

## Sections

Hero · About · Skills · Projects (case studies) · Testimonials · Contact

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Edit your content

Update `src/data/portfolio.ts` — every `[PLACEHOLDER]` is meant to be replaced.

See `NEED-FROM-YOU.md` for the checklist of details still needed.

## Deploy on Vercel (recommended)

### Option A — Dashboard (easiest)

1. Create a free account at [vercel.com/signup](https://vercel.com/signup)
2. Push this project to GitHub (or import the folder)
3. In Vercel: **Add New Project** → import the repo
4. Leave defaults (Framework: Next.js) → **Deploy**
5. Copy your live URL (e.g. `https://freelance-portfolio.vercel.app`) into Upwork / LinkedIn

### Option B — CLI

```bash
npx vercel login
npx vercel --prod
```

After the first deploy, later pushes to the connected GitHub branch auto-update the site.

## Edit your content

Update `src/data/portfolio.ts` — name, projects, rate, links, etc.