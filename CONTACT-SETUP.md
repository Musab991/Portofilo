# Contact form setup

The contact form posts to `/api/contact` and delivers mail to `atiehmusab@gmail.com`.

## Spam protection included

- Hidden honeypot field (bots often fill it; those messages are dropped)
- Minimum fill time (~3 seconds) before submit is accepted
- Rate limit: max 3 messages per IP every 15 minutes
- Field length limits + basic spam keyword / link checks
- Submit button disables while sending

## First-time email activation (important)

Until you add a Resend API key, delivery uses **FormSubmit**.

1. Send one test message from the live contact form
2. Check `atiehmusab@gmail.com` (inbox + spam)
3. Open the FormSubmit activation email and confirm once
4. After that, new form messages arrive as normal emails

## Optional upgrade: Resend

1. Create a free key at [resend.com](https://resend.com)
2. In Vercel → Project → Settings → Environment Variables, add:
   - `RESEND_API_KEY=re_...`
   - optional: `RESEND_FROM=Portfolio <onboarding@resend.dev>`
3. Redeploy
