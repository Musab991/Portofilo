# Master Plan — Portfolio + Workshops

Owner: Eng. Musab Atieh (م. مصعب عطية) · Repo: `Musab991/Portofilo` · Live: musabatieh.com
Status: **planning**. Only app change so far: fake testimonials removed from `portfolio.ts` / home page. Unknown facts are marked `TODO (owner)`.

---

## 0. Current state (what exists today)

| Area | Today |
| --- | --- |
| Framework | Next.js **16.2.11**, React 19.2.4, App Router, TypeScript, CSS Modules (no Tailwind) |
| Build | `output: "export"`, `trailingSlash: true`, `images.unoptimized` → static files in `out/` |
| Deploy | `.github/workflows/deploy-pages.yml`: push to `main` → `npm run build` → `peaceiris/actions-gh-pages` → `gh-pages` branch. Custom domain via `public/CNAME` |
| Pages | One page only: `src/app/page.tsx` (hero, about, skills, projects, testimonials, contact as anchors) |
| Content | Hard-coded TS objects in `src/data/portfolio.ts` (`site`, `about`, `skills`, `projects`, `testimonials`) |
| Contact | `src/components/ContactForm.tsx` posts to FormSubmit (`formsubmit.co/ajax/<email>`) — works on a static site |
| Styling | Tokens in `src/app/globals.css` `:root` (teal palette); fonts Syne / Manrope / IBM Plex Mono (Latin only — **no Arabic glyphs**) |

Issues found while skimming (fix during Phase 1):
- ~~`testimonials` in `portfolio.ts`~~ — owner confirmed they were not real; removed from data and page (done). No testimonials until real students give permission.
- `docs/contact-setup.md` and `docs/repo-structure.md` still describe a server-hosted deploy + `api/contact` routes, which don't exist on a static export. Update or delete.
- `<html lang="en">` is global; workshop pages need `lang="ar" dir="rtl"`.

### Next.js 16 constraints verified in `node_modules/next/dist/docs/`
- Static export does **not** support: dynamic routes without `generateStaticParams()`, `dynamicParams: true`, Route Handlers that read the Request, cookies, rewrites, redirects, Proxy (formerly middleware), ISR. (`02-guides/static-exports.md`)
- Dynamic pages: `params` is a **Promise** → `const { slug } = await params`. Use `export const dynamicParams = false` + `generateStaticParams()`.
- The built-in i18n guide relies on **Proxy** for locale redirects → not usable here. Use static route-scoped language instead (see §3).
- Multiple root layouts via route groups are supported; navigating between them causes a full page reload (acceptable).
- `@next/mdx` has no frontmatter support; docs suggest `gray-matter` / remark plugins.
- `sitemap.ts` / `robots.ts` metadata files are supported and are emitted as static files.

---

## 1. Goals

1. Clean, simple, responsive site with .NET-inspired colors, tokens in one file, optional dark mode.
2. Separate pages: Home/About, CV, Projects, Contact, **Workshops** (most important).
3. Workshops: roadmap from zero → real full-stack project; multiple levels; "next cohort" banner; content in Markdown files so adding a cohort = edit/add a file + push.
4. Registration and payment that work without a server, and are honest about Jordan realities.
5. Visible, honest follow-up process (homework, reviews, rubric).
6. Honest marketing playbook (see `docs/MARKETING.md`).

Non-goals (v1): accounts/login, student dashboards, automatic seat counters, online card checkout, fake urgency.

---

## 2. Sitemap / routes

All routes are statically generated. `trailingSlash: true` → URLs end in `/`.

| Route | Language | Purpose |
| --- | --- | --- |
| `/` | EN | Home + short About, CTA to Projects/Contact, a small Arabic "Workshops" card linking to `/workshops/` |
| `/cv/` | EN | Printable CV (HTML + print CSS) + "Download PDF" (`/cv/Musab-Atieh-CV.pdf` in `public/`) |
| `/projects/` | EN | Project cards from `portfolio.ts` |
| `/projects/[id]/` | EN | Optional case-study page (AVL etc.), `generateStaticParams` from `projects` |
| `/contact/` | EN | Existing FormSubmit form + Telegram/email |
| `/workshops/` | **AR (RTL)** | Hero message, next-cohort banner, roadmap, level cards, how follow-up works, FAQ |
| `/workshops/[slug]/` | AR (RTL) | One level: outline, who it's for/not for, requirements, cohorts, register/pay buttons, FAQ |
| `/workshops/register/` | AR (RTL) | Short link for posts: the on-site form of the open level (or a level picker / "closed" note) |
| `/workshops/[slug]/register/` | AR (RTL) | On-site registration form for that level (FormSubmit → owner's email) + what happens next |
| `/sitemap.xml`, `/robots.txt` | — | via `src/app/sitemap.ts`, `robots.ts` |
| `404` | — | `src/app/not-found.tsx` |

Navigation (top bar, collapses to a menu on mobile): **Home · Projects · CV · Workshops (ورشات) · Contact**. "Workshops" gets an accent pill. On workshop pages, the nav labels switch to Arabic and the order flips (RTL).

---

## 3. Language & RTL decision

**Recommendation: bilingual by section, not full translation.**
- Workshops = **Arabic-first** (the audience is Jordanian students; the source post is Arabic). Technical terms stay in English inline (Git, REST API, ADO.NET).
- Portfolio/CV/Projects = **English** (clients on Upwork/LinkedIn, recruiters).
- No `/ar` `/en` duplication: it doubles maintenance and the Next i18n approach needs Proxy (unsupported in static export).

Implementation (Phase 1):
- Route groups with two root layouts: `src/app/(site)/layout.tsx` → `<html lang="en" dir="ltr">`; `src/app/(workshops)/workshops/...` with `src/app/(workshops)/layout.tsx` → `<html lang="ar" dir="rtl">`. Full reload when crossing groups is fine.
- Fallback if that proves awkward: single root layout + `<div lang="ar" dir="rtl">` wrapper in `workshops/layout.tsx`.
- Use CSS **logical properties** (`margin-inline-start`, `padding-inline`, `inset-inline-end`) everywhere so components work in both directions.
- Add an Arabic font via `next/font/google`, e.g. **IBM Plex Sans Arabic** (pairs with existing IBM Plex Mono) or **Cairo / Tajawal**. `TODO (owner)`: pick one. Latin fonts: simplify to one sans (e.g. Inter or keep Manrope) + mono.

---

## 4. Page-by-page UX (mobile-first)

Breakpoints: base = 360px phone; `48rem` tablet; `64rem` desktop. Max content width `72rem`. Tap targets ≥ 44px. Body 16–18px.

**Home `/`** — Hero (name, title, one-line value, 2 buttons: "View projects", "Hire me"), 3 skill chips rows, 2–3 featured projects, workshop teaser card (Arabic, links to `/workshops/`), footer with links.

**CV `/cv/`** — Single column, semantic sections (Summary, Experience, Projects, Skills, Education, Links). Buttons: "Print" (`window.print()`, small client component) and "Download PDF" (static file). `@media print`: hide nav/footer/buttons, black on white, A4 margins, avoid page breaks inside entries. CV data lives in `src/data/cv.ts` (or extend `portfolio.ts`).

**Projects `/projects/`** — Grid of cards (title, client, stack chips, 1-line result). Card → `/projects/[id]/` with problem/solution/result + screenshots.

**Contact `/contact/`** — Existing form, plus direct links (Telegram, email). Reply-time line.

**Workshops `/workshops/`** (Arabic, RTL) — in this order:
1. Hero: "استثمر بحالك — ابنِ مشروعك بإيدك" + one sentence + buttons "سجّل بالدفعة الجاية" / "شوف المسار".
2. **Next-cohort banner** (component `CohortBanner`): level name, start date (+ "موعد مبدئي" badge if not confirmed), schedule, seats, mode, status pill. States:
   - `open` → green-ish pill "التسجيل مفتوح" + Register button
   - `full` → "المقاعد اكتملت" + "سجّل اهتمامك للدفعة الجاية" (waitlist link)
   - `coming-soon` → "قريباً" + "بلّغني لما يفتح التسجيل"
   - none → "ما في دفعة مجدولة حالياً" + Telegram contact
3. Roadmap (from `content/workshops/roadmap.md`): vertical stepper on mobile, horizontal on desktop: صفر → المستوى 1 → مشروعك → المستوى 2 → شغل / فريلانس / مشروع تخرج.
4. Level cards (one per file, sorted by `level`): title, duration, status, "التفاصيل".
5. "كيف بنتابع معك" (follow-up): homework → review at session start → project milestones → final review (see §8).
6. FAQ (accordion using native `<details>`; no JS).
7. Contact strip (Telegram number).

**Workshop detail `/workshops/[slug]/`** — Banner for that level's cohorts; markdown body (outline, who it's for/not for, what you'll build, requirements, FAQ); sticky bottom CTA on mobile ("سجّل" / "استفسر على تلغرام"). Draft levels show a clear "مسودة — المحتوى قابل للتغيير" notice and no payment button.

**Register `/workshops/[slug]/register/`** (and `/workshops/register/`) — on-site form + steps: (1) fill the form, (2) we reply by email with the Teams link before the start, (3) attend the first 2 sessions free, (4) if you continue, pay 110 JOD via CliQ after session 2 (alias sent privately) and get added to the cohort's Telegram group. Honest note: "أول لقاءين تجربة بدون دفع؛ ما في استرجاع بعد الدفع".

---

## 5. Design tokens

One file: `src/styles/tokens.css` imported by `globals.css` (replace the teal palette). Components only use variables.

```css
:root {
  /* Brand — .NET-inspired purple */
  --purple-950: #140A3D;
  --purple-900: #1E0F5C;
  --purple-800: #2A1580;
  --purple-700: #3A1DAE;
  --purple-600: #512BD4; /* primary (≈7.9:1 on white — AA for text) */
  --purple-500: #6C4BE0;
  --purple-300: #B9A7F2;
  --purple-100: #EDE8FC; /* lavender tint */
  --purple-50:  #F7F5FE;

  /* Neutrals */
  --gray-950: #111018; --gray-800: #2B2A33; --gray-600: #5C5B66;
  --gray-400: #9C9BA6; --gray-200: #E4E3EA; --gray-100: #F1F0F5; --white: #FFFFFF;

  /* Status */
  --success: #1F7A4D; --warning: #A15C00; --danger: #B42318; --info: var(--purple-600);

  /* Semantic */
  --bg: var(--gray-100); --surface: var(--white); --surface-tint: var(--purple-50);
  --text: var(--gray-950); --text-muted: var(--gray-600); --border: var(--gray-200);
  --primary: var(--purple-600); --primary-hover: var(--purple-700); --on-primary: var(--white);
  --accent-bg: var(--purple-100);

  /* Type, space, shape */
  --font-sans: var(--font-body), system-ui, sans-serif;
  --font-ar: var(--font-arabic), "Segoe UI", Tahoma, sans-serif;
  --font-mono: var(--font-mono-face), ui-monospace, monospace;
  --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.125rem;
  --text-xl: 1.375rem; --text-2xl: 1.75rem; --text-3xl: clamp(2rem, 5vw, 3rem);
  --space-1: .25rem; --space-2: .5rem; --space-3: .75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem; --space-16: 4rem;
  --radius-sm: .375rem; --radius: .75rem; --radius-lg: 1.25rem;
  --shadow: 0 8px 24px rgb(20 10 61 / .08);
  --content-max: 72rem;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0F0D18; --surface: #1A1726; --surface-tint: #221C3A;
    --text: #F1F0F5; --text-muted: #B4B2C2; --border: #2E2A42;
    --primary: var(--purple-300); --primary-hover: #CFC2F7; --on-primary: var(--purple-950);
    --accent-bg: #2A2150;
  }
}
:root[data-theme="dark"] { /* same values as above */ }
```

Dark mode is **optional** for v1: tokens support it; a toggle (client component writing `data-theme` + `localStorage`, with an inline pre-hydration script per `02-guides/preventing-flash-before-hydration.md`) can come later. Verify contrast of every text/background pair (WCAG AA ≥ 4.5:1).

---

## 6. Workshop data model

Location: `content/workshops/*.md` (outside `src/`). Files starting with `_` are ignored (template). `roadmap.md` is a special page section, not a level.

One file = one **level** (curriculum). Each level has a `cohorts` list. Adding "next summer" = add one item to `cohorts`. Adding Level 3 = copy `_template.md`.

### Level frontmatter

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `slug` | string | yes | URL: `/workshops/<slug>/`. Lowercase, dashes. Must equal file name without `.md` |
| `title` | string | yes | Arabic title |
| `titleEn` | string | no | English title (for SEO/portfolio link) |
| `level` | number | yes | 1, 2, 3 … sort order |
| `status` | enum | yes | `active` (has/had cohorts) · `coming-soon` · `draft` (visible with draft notice) · `archived` (hidden) |
| `summary` | string | yes | 1–2 sentences for cards |
| `prerequisites` | string[] | yes | |
| `stack` | string[] | yes | chips |
| `durationWeeks` | number \| null | yes | `null` = TODO |
| `sessionsPerWeek` | number \| null | yes | |
| `sessionHours` | number \| null | yes | |
| `totalSessions` | number \| null | no | |
| `language` | string \| null | yes | Level 1: "عربي (والمصطلحات التقنية بالإنجليزي)" |
| `certificate` | boolean \| null | yes | `false` → site shows "ما في شهادة — شهادتك هي مشروعك"; `null` = hidden |
| `telegramUrl` | string | yes | `https://t.me/<username>` — public contact. Phone numbers are not published |
| `refundPolicy` | string \| null | yes for `active` | Arabic text shown on level page + register page |
| `order` | number | no | override sort |
| `cohorts` | Cohort[] | yes | may be `[]` |

### Cohort fields

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | e.g. `2026-12` — unique within level |
| `name` | string | e.g. "دفعة كانون الأول 2026" |
| `status` | enum | `open` · `full` · `coming-soon` · `closed` (finished/cancelled; hidden from banner) |
| `startDate` | `YYYY-MM-DD` \| null | |
| `startDateConfirmed` | boolean | `false` → site shows "موعد مبدئي" |
| `schedule` | string \| null | e.g. "الأحد والأربعاء 7–9 مساءً" |
| `sessionsPerWeek` | number \| null | overrides level value |
| `durationWeeks` | number \| null | overrides level value |
| `seats` | number \| null | real cap only; `null` = no fixed cap (current Level 1 policy) → site shows no seat/scarcity text. Site never shows a fake "remaining" count |
| `seatsLeft` | number \| null | optional, only if owner updates it manually and truthfully |
| `price` | number \| null | `null` → "السعر: تواصل معنا" |
| `currency` | string | `JOD` |
| `earlyBird` | object \| null | `{ price, until }` — only if real |
| `mode` | enum \| null | `online` · `in-person` · `hybrid` |
| `location` | string \| null | platform (Level 1: Microsoft Teams) or city/venue |
| `registrationEmail` | string \| null | inbox (or FormSubmit alias) for the on-site form. `open` + set → "سجّل الآن" → `/workshops/<slug>/register/` (Level 1: musabatieh48@gmail.com) |
| `registrationUrl` | string \| null | optional external form, used only when `registrationEmail` is null |
| `waitlistUrl` | string \| null | form for "notify me" |
| `paymentUrl` | string \| null | optional, **future only** (e.g. PayPal, after verifying it works in Jordan). Not used for Level 1 |
| `paymentMethods` | string[] | Level 1: `["CliQ"]` — shown as text; the CliQ alias is sent privately and **never stored in the repo** |
| `registrationDeadline` | `YYYY-MM-DD` \| null | |
| `notes` | string \| null | |

### Loading (build time, no server)
- `src/lib/workshops.ts` (server-only): `fs.readdirSync("content/workshops")`, `gray-matter` to parse, validate required fields (throw at build on bad data → the GitHub Action fails instead of shipping a broken page), render body with a markdown lib (`marked` or `remark` + `remark-html` + `remark-gfm`). `TODO (owner)/dev`: approve adding `gray-matter` + one markdown renderer as dependencies.
- `src/app/(workshops)/workshops/[slug]/page.tsx`: `generateStaticParams()` returns non-archived slugs; `export const dynamicParams = false`; `const { slug } = await params`.
- Banner logic `getNextCohort()`: across non-archived levels, pick cohorts with status `open` first, then `coming-soon`, then `full`; tie-break by earliest `startDate`. None → "none scheduled" state. **Status is the source of truth**, not the date: static pages are computed at build time, so a date-based rule can go stale.
- Optional: add `schedule: - cron: "0 3 * * *"` to the deploy workflow so the site rebuilds daily (keeps "past date" handling fresh). Low priority.
- Optional: `content/workshops/schema.json` (JSON Schema) + VS Code YAML extension for autocomplete; or a `zod` schema in `workshops.ts`.

---

## 7. Registration & payment

### Registration options (static site)

| Option | Cost | Setup | Pros | Cons |
| --- | --- | --- | --- | --- |
| **Google Forms → Google Sheets** | Free | 10 min | Familiar to students, Arabic/RTL works, responses in a Sheet, email notifications, can collect email, no code | Leaves the site (or iframe embed, looks generic); basic validation; Google branding |
| Tally | Free tier generous | 15 min | Nicer UI, embeddable, RTL support, unlimited free submissions (verify current limits) | Another account; some features paid |
| Formspree / Web3Forms / FormSubmit (already used) | Free tiers (Formspree ~50/mo; verify) | 30 min + code | Native form on your site, matches design | Results in email only (or paid dashboard); spam handling; free-tier limits |
| Telegram / WhatsApp deep link | Free | 5 min | Zero friction, owner already uses Telegram, immediate conversation | No structured data, easy to lose track, not scalable |
| Supabase / Cloudflare Worker + DB | Free tiers | 1–3 days | Real backend: auto confirmation email, seat counting, admin view | Must build, secure, and maintain; overkill for v1 |

**Decision (owner, Oct 2026) — replaces the Google Forms plan:** a **native form on the site** (`/workshops/<slug>/register/`, short link `/workshops/register/`) that posts to **FormSubmit** (AJAX, same pattern as `ContactForm.tsx`) and **emails the owner directly** at the cohort's `registrationEmail` (**musabatieh48@gmail.com** — set only in the Level 1 frontmatter). No Google Form, no Sheet.
- Fields (minimal): الاسم, الإيميل, العمر (15–70), الوضع الحالي (طالب جامعي / خريج / غير ذلك), اسم الجامعة (shown and required only for طالب جامعي / خريج; Arabic or English; sent as `university` after `current_status`, not sent for غير ذلك), الهدف من المشروع (مشروع تخرج / مشروع للـ CV والشغل / مشروع للسوق), ملاحظة (optional). Hidden: level slug, cohort id, cohort start date.
- Input hardening (`src/components/workshops/sanitize.ts`): every text value is NFC-normalized, trimmed, whitespace-collapsed, and stripped of control chars and zero-width/bidi-override chars. Name (2–60) and university (2–100) use an allowlist (Arabic letters incl. diacritics/tatweel, Latin letters, spaces, `. - ' ( ) & ,`, digits for university only) and reject `<` `>`, `{{` `}}`, `javascript:`/`data:` and links, with Arabic errors. Note ≤ 300 chars, `<` `>` stripped. Email ≤ 100, strict ASCII pattern. Limits are enforced by `maxLength` and in validation. The subject uses the cleaned name only (no newline/CR can reach it). Spreadsheet formula injection: name/university must start with a letter (digit allowed for university), and a note starting with `= + - @` gets a leading apostrophe. User input is rendered only as React text (no `dangerouslySetInnerHTML` in the form path).
- Rate limiting (client-side only, static site): one successful submission per 60 s per browser (timestamp in `localStorage`, in-memory fallback), the button is disabled with an Arabic countdown, and an in-flight guard blocks double submits. **Honest limit:** together with the honeypot and minimum fill time this stops accidental/double submits and casual abuse, not a determined attacker (anyone can clear storage or call FormSubmit directly). Real protection is FormSubmit's own spam filtering. Upgrade options: a server/edge function (e.g. a Cloudflare Worker with Turnstile) in front of the email, or FormSubmit's `_captcha` (kept off: its captcha page does not fit the AJAX flow).
- Subject: `تسجيل جديد — <short level title> (Level N) — دفعة <D> <month> <YYYY> — <الاسم>`, `_template: table`, `_replyto` = student email (owner just hits Reply), honeypot `_honey`, `_captcha: false`, plus a minimum fill time.
- Flow: form → owner replies **by email** with the Teams link before the start → first 2 sessions free → student who continues pays via **CliQ** after session 2 → owner adds them to the **cohort's Telegram group**. Telegram (`t.me/musabatieh`) is only a secondary "عندك سؤال؟" link, not the registration channel.
- **FormSubmit one-time activation:** the first submission to a new address is not delivered; FormSubmit emails an "Activate Form" link to that inbox. Owner submits one test registration, clicks Activate (check Spam), then tests again. Afterwards FormSubmit offers a random alias; it can replace the address in `registrationEmail` (the loader accepts an email or an alias) to keep the address out of the page source.
- Limits: results live in email only (no dashboard); FormSubmit is a free third-party service, so keep the Telegram fallback visible on errors. The portfolio contact form in `src/` keeps its own address (unchanged).
- `registrationUrl` stays optional in the model for a future external form (used only when `registrationEmail` is empty).

**Upgrade path:**
1. v1.1 — If email-only gets messy: post the same form to a **Google Apps Script web app → Sheet**, or Tally.
2. v2 — Cloudflare Worker or Supabase: confirmation email, automatic `seatsLeft`, waitlist, simple admin page. Only when volume justifies it (e.g. > ~40 applicants per cohort).

### Payment — honest notes for Jordan

Rule for v1 (owner decision): **the first 2 sessions are a free trial — no payment before session 2.** After session 2, a student who continues pays 110 JOD via **CliQ only**. No refund after payment.

| Method | Works on static site? | Jordan reality — **verify before publishing** |
| --- | --- | --- |
| **CliQ** (Jordan instant payments via banks) | Yes (show alias/instructions privately, not on public page) | Widely used locally; check your bank's CliQ alias, limits, and any fees |
| Bank transfer | Yes | Slower; fine for students with bank accounts |
| Cash (in-person sessions) | n/a | Give a receipt (even a simple numbered one) |
| E-wallets (e.g. Orange Money, Zain Cash) | Yes | Verify you can receive and fees |
| **PayPal** (PayPal.me link, Payment Links, or Smart Buttons — all work client-side) | Yes, technically easy | **Uncertain**: whether a Jordan-registered PayPal account can *receive* payments and withdraw to a local bank has historically been limited. Verify in your own account (Receive → withdraw to Jordanian bank) and the fees (cross-border + currency conversion) before offering it. Most local students may not have PayPal. Useful mainly for students abroad |
| Card checkout (Stripe etc.) | Needs provider support | Stripe does not list Jordan as a supported country as far as known — verify; not for v1 |

**Decision v1:** price **110 JOD** (Level 1, owner decision; was 150), **CliQ only**, paid **after session 2**. The owner sends the CliQ alias privately (Telegram) after session 2 — never published or committed. Student sends a payment screenshot on Telegram; owner logs it in the Sheet (columns: paid, amount, date, CliQ reference). PayPal (`paymentUrl`) stays a possible **future** option only, for students abroad, after the owner verifies receiving + withdrawal in Jordan.

**Trial & refund policy (owner decision):** the first 2 sessions are a **free trial** (no payment). A student who continues pays **110 JOD via CliQ after session 2**. **No refund after payment.** Arabic text: "أول لقاءين تجربة بدون دفع؛ إذا كمّلت بتدفع 110 دنانير عن طريق CliQ بعد اللقاء الثاني؛ ما في استرجاع بعد الدفع." Shown on the level page, register page and FAQ before session 1.

---

## 8. Follow-up & review process

Shown on the site as a short "كيف بنتابع معك" section + rubric table on each level page.

Process (lightweight, owner can run it alone):
1. **Before start:** each student creates a GitHub repo for the cohort project and shares the link (Sheet column). Optional: one GitHub Classroom / org per cohort `TODO (owner)`.
2. **Every session:** first 10–15 min = homework check. Homework is submitted as a **commit/PR** before the session. Owner marks: ✅ done · ◐ partial · ❌ missing.
3. **Milestones (Level 1):** M1 requirements + DB design (week 1–2), M2 working API (week 3), M3 frontend connected (week 5), M4 deployed + README (week 6). Each gets a short written review (PR comment).
4. **Final review:** demo (5–10 min) + rubric score + 3 written notes (strength, fix, next step).
5. **Feedback form** at the end (anonymous Google Form) → owner uses it to improve; publish quotes **only with written permission**.

Rubric (each 1–4): Requirements & DB design · Backend/API correctness · Code quality (naming, structure, OOP) · Frontend (works, responsive) · Git usage (meaningful commits, branches, PRs) · Deployment & README · Homework consistency. Shown to students from day one.

Tracking: one Google Sheet per cohort — tabs: Students, Attendance, Homework, Milestones, Payments. Template to be created by owner (Phase 3 task).

Future (only with real data): `/workshops/showcase/` with student projects (with permission, linking their GitHub), and testimonials collected via the feedback form with name + consent. **No placeholder or invented testimonials, ever.**

---

## 9. Implementation phases

### Phase 1 — UI refactor + tabs
Tasks:
- Add `src/styles/tokens.css` (§5); replace teal tokens; remove decorative gradients that hurt readability.
- Fonts: one Latin sans + mono + one Arabic font via `next/font/google`.
- Route groups + two root layouts (`(site)` EN/LTR, `(workshops)` AR/RTL); shared `Header`/`Footer` with active link state and mobile menu (accessible: button `aria-expanded`, focus trap not required, Esc closes).
- Split the single page into `/`, `/projects/`, `/projects/[id]/`, `/cv/`, `/contact/`; keep data in `src/data/`.
- CV page + print CSS + `public/cv/Musab-Atieh-CV.pdf`.
- `not-found.tsx`, `sitemap.ts`, `robots.ts`, per-page `metadata`.
- (Done) Testimonials removed. Update stale docs (hosting/API references).
Acceptance:
- `npm run build` passes; `out/` contains `index.html`, `projects/index.html`, `cv/index.html`, `contact/index.html`, `workshops/index.html` (placeholder OK).
- No horizontal scroll at 360px; Lighthouse mobile Accessibility ≥ 95, Performance ≥ 90.
- All colors come from tokens (grep finds no hex values in `*.module.css` except tokens file).
- CV prints cleanly on A4 in Chrome (1–2 pages, no nav/buttons).
- Deployed site works under the custom domain with trailing slashes.

### Phase 2 — Workshops from content files
Tasks:
- Add `gray-matter` + markdown renderer; `src/lib/workshops.ts` with validation.
- `/workshops/` (hero, `CohortBanner`, roadmap, level cards, follow-up, FAQ) and `/workshops/[slug]/` with `generateStaticParams` + `dynamicParams = false`.
- Draft notice for `status: draft | coming-soon`; hide `archived`.
- Render `null` fields gracefully ("سيتم الإعلان قريباً" / hidden), never show "null" or "TODO".
- Open Graph image/metadata per level (Arabic title) for sharing in Telegram/WhatsApp groups.
Acceptance:
- Adding a cohort to `level-1-graduates-camp.md` and pushing changes the banner after the Action finishes, with no code change.
- Copying `_template.md` to `level-3-x.md` creates `/workshops/level-3-x/` automatically.
- Invalid frontmatter (e.g. missing `slug`, bad status) fails the build with a clear message.
- The build fails if the text `TODO` appears in the body of a level whose status is `active` (Level 1 body currently has none).
- Pages are `dir="rtl"`, Arabic font renders, mixed English terms display correctly.
- Every banner state (`open`, `full`, `coming-soon`, none) verified with sample data.

### Phase 3 — Registration & payment
Tasks:
- ~~Owner creates Google Form~~ → replaced by the on-site FormSubmit form (§7). **Done:** `/workshops/<slug>/register/` + `/workshops/register/`, Level 1 cohort `open`. Owner: activate FormSubmit once (§7).
- Register page with the steps and the honest "first 2 sessions free, pay via CliQ after session 2, no refund after payment" note. **Done.**
- Payment (CliQ only, after session 2) and the policy are rendered from `paymentMethods` + `refundPolicy`.
- (Future) PayPal link only after verification.
- Cohort tracking Sheet template (Students, Attendance, Homework, Milestones, Payments).
Acceptance:
- After FormSubmit activation, a test submission arrives at `registrationEmail` with the expected subject and reply-to.
- Register buttons hide/disable automatically when status is not `open` (show waitlist instead).
- No bank/CliQ account details published on the public site.
- Price and the trial/no-refund policy are visible before session 1; no CliQ alias appears anywhere in the repo or site.

### Phase 4 — Marketing & analytics
Tasks:
- Follow `docs/MARKETING.md` (positioning, posts, cadence).
- Privacy-friendly analytics: Cloudflare Web Analytics or GoatCounter (free, no cookie banner needed in most setups — verify) or Plausible (paid). Next 16 has `02-guides/analytics.md` for client reporting.
- UTM-style source tags on links shared in each group (`?src=tg-ju`, etc.) + "how did you hear" form field.
- Showcase page once real student projects exist (with permission).
Acceptance:
- Owner can see visits to `/workshops/` per source after one campaign.
- Every published post passes the honesty checklist in `MARKETING.md`.

---

## 10. Risks

| Risk | Mitigation |
| --- | --- |
| Stale banner (date passed, status still `open`) | Status is manual source of truth; checklist in `ADDING-A-WORKSHOP.md`; optional daily rebuild cron |
| Build breaks from a typo in frontmatter | Validation with clear errors; owner previews with `npm run build` locally or checks the Actions tab |
| Student pays then wants a refund | Policy shown before session 1: 2 free trial sessions, payment after session 2, no refund after payment. Owner sends the CliQ alias only after session 2 |
| Collecting personal data (registration emails via FormSubmit) | Only needed fields (no phone, no university); data sits in the owner's inbox only; delete old registration emails after a set period `TODO (owner)` |
| FormSubmit not activated / down | Owner activates once with a test submission; the form's error state shows the Telegram link as fallback |
| RTL/LTR layout bugs | Logical CSS properties; test both directions |
| Over-promising in marketing | Honesty rules + FAQ; no job guarantees |
| Owner capacity (reviewing many students alone) — higher now that there is **no seat cap** | Rubric + PR-based reviews; owner sets a private max he can review well; if reached, set status `full` (truthfully) or split into a second group |
| Cohort runs through Christmas / New Year and close to university exams | Owner decided no sessions are skipped (25 Dec and 1 Jan are Fridays). General tip: check university exam periods when picking future cohort dates |
| Session days may change "based on the group" | Stated to students in advance; announce changes with notice; keep days in frontmatter up to date |
| Adding new deps conflicts with Next 16 | Only small, framework-agnostic libs (`gray-matter`, `marked`); read docs before use |

---

## 11. Decisions needed from owner

### Resolved (owner answers, Oct 2026)
- ~~Price~~ → **110 JOD** for Level 1 (owner decision; lowered from 150). Installments still open (see below).
- Mentorship (owner decision): after the 6 weeks, the owner stays with the cohort **until the end of the semester** — questions in the cohort Telegram group + "مراجعة دورية لمشروعك". Guidance and review only; the student writes the code. Never advertised as "until graduation/job". **Open:** review frequency (owner to confirm).
- ~~Start date~~ → **2026-12-21** (Monday, first session), confirmed. Sessions run Dec 21 – Jan 27; no sessions skipped over the holidays.
- ~~Session days~~ → **Monday & Wednesday**, 2 per week; days may change based on the group, with advance notice.
- ~~Session time~~ → **7:00 – 10:00 PM Jordan time** ("7:00 – 10:00 مساءً بتوقيت الأردن").
- ~~Session length~~ → **3 hours** (was 2 in the original post): 6 weeks × 2 = 12 sessions = 36 hours.
- ~~Mode / platform~~ → **online only**, on **Microsoft Teams**.
- ~~Seat count~~ → **no fixed cap**. All scarcity wording removed; `full` status kept in the model for future cohorts.
- ~~Payment & refund~~ → **CliQ only**, paid **after session 2**; first 2 sessions are a free trial; **no refund after payment**. CliQ alias sent privately, never in the repo. PayPal = possible future option only.
- ~~Registration tool~~ → **on-site form via FormSubmit** emailing the owner (replaces Google Forms). Level 1 cohort is `open`.
- ~~Language of instruction~~ → **Arabic**, technical terms in English.
- ~~Portfolio contact~~ → phone/WhatsApp removed from the portfolio; Telegram https://t.me/musabatieh shown instead.
- ~~Certificate~~ → **none**; the project (on GitHub, deployed) is the outcome.
- ~~Registration data~~ → name, email, age, current situation, university (only for students/graduates), project goal (required) + optional note. Nothing else.
- ~~Registration email~~ → **musabatieh48@gmail.com** (`registrationEmail` in the Level 1 frontmatter — the only place it is set). Portfolio contact form email in `src/` unchanged.
- ~~Telegram role~~ → not a registration channel. Students are added to the cohort's Telegram group after the 2 free sessions, once they continue/pay. Public Telegram link = questions only.
- ~~Public contact~~ → **https://t.me/musabatieh** (Telegram); the phone number is not published anywhere in the repo.
- ~~Testimonials~~ → the two in `portfolio.ts` were not real; **removed** (data + section). Testimonials stay empty until real students give written permission.
- ~~Missed sessions~~ → **live only, no recordings**; the student is responsible for catching up (homework, repo, asking on Telegram).
- ~~Laptop / software~~ → Windows laptop; Visual Studio Community, SQL Server Express + SSMS, VS Code, Git (all free).
- ~~Student FAQ~~ → approved by the owner.

### Still open
1. **Installments / early-bird** for the 110 JOD price: yes / no.
2. **Activate FormSubmit** for musabatieh48@gmail.com: submit one test registration on `/workshops/register/`, click "Activate Form" in the email (check Spam), test again. Optionally switch `registrationEmail` to the FormSubmit alias afterwards.
3. **Level 2**: duration, price, start window, and frontend framework (React / Angular / Blazor / Vue).
4. **Arabic font** (IBM Plex Sans Arabic / Cairo / Tajawal).
5. **Dark mode** in v1 or later.
6. **New dependencies** OK (`gray-matter`, markdown renderer)?
7. **Data retention**: how long to keep registration emails.
8. **Homework policy** when a student repeatedly misses homework.
9. An honest **weekly homework-hours estimate**.
10. **Private review capacity**: max students you can review well (no public cap, but you may need to split groups).
11. **Showcase**: ask students' permission to publish projects/names?
12. **Analytics** tool (Cloudflare Web Analytics / GoatCounter / none).
13. **Dedicated Telegram announcement channel**, or keep posting only in groups?
