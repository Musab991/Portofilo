# Contact form email setup

Your form sends to **atiehmusab@gmail.com**. Best option: Gmail App Password on Vercel.

## Gmail App Password (recommended)

1. Google Account → **Security** → **2-Step Verification** → **App passwords**
2. Create password for Mail
3. In [Vercel → Environment Variables](https://vercel.com/lords5/freelance-portfolio/settings/environment-variables):

| Name | Value |
| --- | --- |
| `GMAIL_USER` | `atiehmusab@gmail.com` |
| `GMAIL_APP_PASSWORD` | your 16-char app password |

4. Redeploy and test the contact form

## FormSubmit fallback

First submission may send an **activation** email — check Inbox + Spam, click Confirm once.
