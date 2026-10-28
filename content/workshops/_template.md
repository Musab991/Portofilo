---
# ============================================================
# TEMPLATE — copy this file, rename it to <slug>.md, fill it in.
# Files starting with "_" are ignored by the site.
# Leave unknown values as null (the site hides them). Never write "TODO" in a value
# that the site displays — use null and a comment instead.
# Full guide: docs/ADDING-A-WORKSHOP.md
# ============================================================

slug: level-3-example          # must match the file name (without .md). lowercase-with-dashes
title: "المستوى 3: عنوان الورشة"   # Arabic title shown on the site
titleEn: "Level 3: Workshop title" # optional, English
level: 3                       # 1, 2, 3 ... (sort order on the roadmap)
status: draft                  # active | coming-soon | draft | archived
summary: "جملة أو جملتين بتوصف الورشة على الكرت."
prerequisites:
  - "إنهاء المستوى 2 أو مستوى مكافئ"
stack:
  - "C#"
  - "SQL Server"
durationWeeks: null            # number, e.g. 6
sessionsPerWeek: null          # number, e.g. 2
sessionHours: null             # number, e.g. 2
totalSessions: null            # number, e.g. 12
language: null                 # e.g. "عربي مع المصطلحات بالإنجليزي"
certificate: null              # true | false | null (null = not decided, hidden)
telegramUrl: "https://t.me/musabatieh"   # Telegram username/channel link (don't publish a phone number)
refundPolicy: null             # Arabic text. Level 1 policy: "أول لقاءين تجربة بدون دفع؛ إذا كمّلت بتدفع 110 دنانير عن طريق CliQ بعد اللقاء الثاني؛ ما في استرجاع بعد الدفع."

cohorts: []                    # no cohort yet. To add one, replace [] with a list like below:
# cohorts:
#   - id: "2027-07"                       # unique, e.g. year-month
#     name: "دفعة صيف 2027"
#     status: coming-soon                 # open | full | coming-soon | closed
#     startDate: "2027-07-01"             # YYYY-MM-DD or null
#     startDateConfirmed: false           # false = site adds "(الموعد قابل للتغيير)" after the date
#     schedule: null                      # e.g. "الأحد والأربعاء 7–9 مساءً"
#     sessionsPerWeek: null               # overrides the level value if set
#     durationWeeks: null                 # overrides the level value if set
#     seats: null                         # number ONLY if there is a real cap; null = no fixed cap (then never say "limited seats")
#     seatsLeft: null                     # only if you update it honestly by hand
#     price: null                         # number, e.g. 100 (null = "تواصل معنا")
#     currency: "JOD"
#     earlyBird: null                     # e.g. { price: 80, until: "2027-06-15" } — only if real
#     mode: null                          # online | in-person | hybrid
#     location: null                      # platform (e.g. "Microsoft Teams") or city/venue
#     registrationEmail: "musabatieh48@gmail.com"   # inbox for the on-site register form (FormSubmit). With status "open" → "سجّل الآن" button → /workshops/<slug>/register/
#     registrationUrl: null               # optional external form instead (only used when registrationEmail is null)
#     waitlistUrl: null                   # "notify me" form link
#     paymentUrl: null                    # optional, future only (e.g. PayPal) — not used for Level 1
#     paymentMethods: ["CliQ"]            # current policy: CliQ only. NEVER put the CliQ alias/account here — send it privately
#     registrationDeadline: null          # YYYY-MM-DD — only if it is a REAL closing date
#     notes: null                         # e.g. "أيام اللقاءات ممكن تتغير حسب الجروب، وبنبلّغكم قبلها بوقت كافي."
---

<!-- Body = normal Markdown (Arabic). Suggested sections: -->

## شو الفكرة؟

## المحتوى

### المرحلة 1: ...

## شو رح تبني؟

## لمين هاي الورشة؟

## مش إلك إذا...

## شو المطلوب منك؟

## كيف بنتابع معك؟

## أسئلة شائعة
