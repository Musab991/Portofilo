# GitHub Pages setup — READ THIS

Your site showed **README text** because Pages was set to deploy **`main` branch / (root)**.
That serves the markdown files — not the built website.

## Fix (2 minutes)

### Step 1 — Change Pages source

1. Open [Settings → Pages](https://github.com/Musab991/Portofilo/settings/pages)
2. Under **Build and deployment → Source**, change:
   - **From:** Deploy from a branch → `main` / `(root)` ❌
   - **To:** Deploy from a branch → **`gh-pages`** / **`/(root)`** ✅
3. Click **Save**

### Step 2 — Wait for Actions

1. Open [Actions tab](https://github.com/Musab991/Portofilo/actions)
2. Wait for **Deploy to GitHub Pages** to finish with a green checkmark
3. If it failed, click **Re-run all jobs**

### Step 3 — Test

- https://musabatieh.com — should show your portfolio (hero, photo, projects)
- Hard refresh: `Ctrl + F5`

## DNS (Hostinger) — you already have this correct

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `185.199.108.153` (+ .109, .110, .111) |
| CNAME | `www` | `musab991.github.io` |

## Do NOT use

- **main / (root)** as Pages source — shows README only
- CNAME file at repo root on `main` — not needed (it's inside `public/` and copied to the build)

## Contact form

Uses FormSubmit from the browser. First send may need activation email in `atiehmusab@gmail.com` (check Spam).
