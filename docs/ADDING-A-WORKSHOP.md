# Adding or updating a workshop

> Applies once Phase 2 of `docs/PLAN.md` is built. Until then these files are content only.

All workshop content lives in `content/workshops/`:

| File | What it is |
| --- | --- |
| `_template.md` | Copy this to make a new level. Ignored by the site (starts with `_`) |
| `level-1-graduates-camp.md` | Level 1 + its cohorts |
| `level-2-clean-architecture.md` | Level 2 (draft) |
| `roadmap.md` | The student journey shown on `/workshops/` |

**Words:** a *level* = a curriculum (one file). A *cohort* (دفعة) = one run of that level with a date. Most of the time you only add a cohort.

Every push to `main` rebuilds the site (GitHub Actions → `gh-pages`). It's live after the "Deploy to GitHub Pages" run turns green (usually 1–3 min). Check: GitHub repo → **Actions** tab.

---

## A. Add a new cohort (e.g. "next summer") — most common

1. Open `content/workshops/level-1-graduates-camp.md`.
2. Under `cohorts:`, copy an existing cohort block and paste it below. Keep the indentation (2 spaces, then `- id:`).
3. Change at least:
   ```yaml
   - id: "2027-07"                 # unique
     name: "دفعة صيف 2027"
     status: coming-soon           # or open when ready
     startDate: "2027-07-01"
     startDateConfirmed: false     # true once the date is final
     schedule: "الاثنين والأربعاء، 7:00 – 10:00 مساءً بتوقيت الأردن"
     seats: null                   # null = no fixed cap (current policy). Use a number only for a real cap
     price: 150
     currency: "JOD"
     mode: online
     location: "Microsoft Teams"
     registrationUrl: "https://forms.gle/..."
     notes: "أيام اللقاءات ممكن تتغير حسب الجروب، وبنبلّغكم قبلها بوقت كافي."
   ```
   Set `startDate` to the date of the **first session** (e.g. a Monday if sessions are Mon/Wed). Tip: check university exam periods before picking dates.
4. Unknown values: write `null` (the site hides them). Don't write "TODO" in a value.
5. Commit and push:
   ```bash
   git add content/workshops
   git commit -m "Add summer 2027 cohort for Level 1"
   git push origin main
   ```
6. After the Action finishes, open `musabatieh.com/workshops/` and check the banner.

You can edit directly on github.com too: open the file → pencil icon → edit → "Commit changes" to `main`. Same result.

## B. Open / close / mark full

Change only the cohort's `status`:

| Status | When | Site shows |
| --- | --- | --- |
| `coming-soon` | Date planned, registration not open yet | "قريباً" + waitlist button (if `waitlistUrl`) |
| `open` | Form ready, price known, you accept students | "التسجيل مفتوح" + Register button |
| `full` | Seats really filled | "المقاعد اكتملت" + waitlist button |
| `closed` | Cohort finished or cancelled | Hidden from the banner |

**To close registration:**
1. Set `status: full` (seats filled) or `closed` (stop entirely). Push.
2. In Google Forms → **Responses** → turn off **Accepting responses** (and set a closed message, e.g. "التسجيل مسكّر لهاي الدفعة — تابعنا للدفعة الجاية"). The form link may still be shared in old posts, so this step matters.
3. Optional: post a short "closed" message in the groups (template in `MARKETING.md`).

After the cohort ends: set `status: closed`. Keep the block (history) or delete it.

## C. Add a new level

1. Copy `_template.md` → `level-3-<short-name>.md` (e.g. `level-3-cloud-deploy.md`).
2. Set `slug` to the same name without `.md`. Set `level: 3`, `status: draft` while writing.
3. Write the body in Markdown (headings `##`, lists `-`).
4. Add a step for it in `roadmap.md` (`steps:` list, `link:` = the slug).
5. Push. The page appears at `/workshops/level-3-<short-name>/`.
6. Change `status` to `coming-soon` / `active` when ready.

To hide a level: `status: archived`.

## D. Before you push — checklist

- [ ] `status` is correct and matches reality (no "open" if you can't take students).
- [ ] `startDateConfirmed` is `false` unless the date is final.
- [ ] `seats` is `null` (no cap) or the real cap. `seatsLeft` only if you'll keep updating it honestly — otherwise `null`. No "limited seats" text when there's no cap.
- [ ] `price` + `refundPolicy` are set before status `open` (Level 1: first 2 sessions are a free trial, pay 150 JOD via CliQ after session 2, no refund after payment).
- [ ] Contact uses `telegramUrl`, not a phone number.
- [ ] `registrationUrl` works in a private/incognito window and the form is accepting responses.
- [ ] No bank account / CliQ alias anywhere in the repo (it is public). Send payment details privately.
- [ ] No "TODO" text left in the body of a non-draft level.
- [ ] Dates use `YYYY-MM-DD` with quotes, e.g. `"2027-07-01"`.

## E. If the deploy fails

- GitHub → **Actions** → open the red run → read the error. A frontmatter mistake should show the file name and field (Phase 2 adds this validation).
- Common YAML mistakes: wrong indentation, a missing `"` around text that contains `:`, tabs instead of spaces.
- Check locally before pushing (optional): `npm install` once, then `npm run build`.
- The previous version stays live until a build succeeds, so a failed build doesn't break the site.

## F. Optional: daily rebuild

Static pages are generated at build time. If you want date-based text refreshed without pushing, add to `.github/workflows/deploy-pages.yml` under `on:`:
```yaml
  schedule:
    - cron: "0 3 * * *"   # every day 03:00 UTC
```
Not required — `status` is what the site trusts.
