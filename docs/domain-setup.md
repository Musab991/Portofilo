# Custom domain setup (musabatieh.com)

Your portfolio runs on **Vercel**, not GitHub Pages.

If DNS points to GitHub (185.199.108.x), visitors see the **README text** instead of your website.

## Step 1 — Add domain in Vercel

1. Open [Vercel → freelance-portfolio → Settings → Domains](https://vercel.com/lords5/freelance-portfolio/settings/domains)
2. Add `musabatieh.com`
3. Add `www.musabatieh.com`
4. Vercel will show the exact DNS records to use — copy those

## Step 2 — Fix DNS in Hostinger

Replace the current GitHub records with Vercel records:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| **A** | `@` | `76.76.21.21` | 3600 (or default) |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

**Remove** these old GitHub Pages records:
- A records → `185.199.108.153`, `.109.`, `.110.`, `.111.`
- CNAME `www` → `musabatieh.github.io`

## Step 3 — Disable GitHub Pages (optional but recommended)

1. GitHub repo → **Settings** → **Pages**
2. Set Source to **None** / disable Pages
3. This stops GitHub from serving README on your domain

## Step 4 — Wait and test

DNS can take **5 minutes to 48 hours** (usually under 1 hour).

Test:
- https://musabatieh.com — should show your portfolio (hero, projects, contact)
- https://freelance-portfolio-lyart-one.vercel.app — always works as backup

## Why you saw README text

GitHub Pages only serves static files. It rendered `README.md` because your DNS pointed there. Next.js needs Vercel (or similar) to run the app.
