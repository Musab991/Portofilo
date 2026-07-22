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

## Deploy

### Vercel

1. Push this repo to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. Deploy (Next.js defaults work as-is).

### Netlify

1. Push to GitHub.
2. New site from Git in Netlify.
3. Build command: `npm run build`
4. Publish directory: `.next` — or use the [Netlify Next.js runtime](https://docs.netlify.com/frameworks/next-js/overview/).

For a fully static export later, you can add `output: "export"` in `next.config.ts` if you do not need server features.

## Stack

- Next.js (App Router)
- TypeScript
- CSS Modules (no Tailwind dependency)
