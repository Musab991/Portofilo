# Custom domain — GitHub Pages (musabatieh.com)

This site is published via **GitHub Pages**, not Vercel.

## Step 1 — Enable GitHub Pages

1. Open [github.com/Musab991/Portofilo/settings/pages](https://github.com/Musab991/Portofilo/settings/pages)
2. **Build and deployment → Source:** GitHub Actions
3. After pushing to `main`, the workflow **Deploy to GitHub Pages** runs automatically
4. Wait until it shows a green checkmark under **Actions**

## Step 2 — Hostinger DNS (keep GitHub records)

| Type | Name | Value |
| --- | --- | --- |
| **A** | `@` | `185.199.108.153` |
| **A** | `@` | `185.199.109.153` |
| **A** | `@` | `185.199.110.153` |
| **A** | `@` | `185.199.111.153` |
| **CNAME** | `www` | `musab991.github.io` |

Important: `www` must point to **`musab991.github.io`** (your GitHub username), not `musabatieh.github.io`.

## Step 3 — Custom domain in GitHub

1. Repo → **Settings → Pages → Custom domain**
2. Enter `musabatieh.com` → Save
3. Wait for DNS check (can take up to 24h, usually ~1h)
4. Enable **Enforce HTTPS** when available

## Step 4 — Test

- https://musabatieh.com — your portfolio (hero, projects, contact)
- https://musab991.github.io/Portofilo/ — backup URL (project path)

## Contact form on GitHub Pages

The form uses **FormSubmit** directly from the browser (no server API).

First message may require activating FormSubmit via email to `atiehmusab@gmail.com` (check Spam).

## If you still see README text

The GitHub Actions deploy has not finished yet. Check **Actions** tab — wait for **Deploy to GitHub Pages** to complete, then hard-refresh the site.
