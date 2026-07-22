# Fix contact email (so messages reach Gmail)

Your form can send in 3 ways. **Gmail App Password is the most reliable.**

## Option A — Gmail App Password (recommended, ~2 minutes)

1. Open Google Account → **Security**
2. Turn on **2-Step Verification** (required)
3. Create an **App password** (App: Mail)
4. Copy the 16-character password
5. In [Vercel project settings → Environment Variables](https://vercel.com/lords5/freelance-portfolio/settings/environment-variables) add:

| Name | Value |
| --- | --- |
| `GMAIL_USER` | `atiehmusab@gmail.com` |
| `GMAIL_APP_PASSWORD` | *(the 16-char app password)* |

6. Redeploy the site
7. Send a test message from the contact form

Messages will arrive in **atiehmusab@gmail.com** with Reply-To set to the client’s email.

## Option B — Web3Forms (free key)

1. Get a key at [web3forms.com](https://web3forms.com) (enter your email)
2. Add Vercel env: `WEB3FORMS_ACCESS_KEY=your_key`
3. Redeploy

## Option C — FormSubmit (current fallback)

First submission may only send an **activation** email (check Inbox + Spam).
Click Confirm once, then try again.

## Spam protection still active

- Hidden honeypot (renamed so Chrome won’t autofill it)
- Min fill time
- Rate limit per IP
- Length + spam checks
