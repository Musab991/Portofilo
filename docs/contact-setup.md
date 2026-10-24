# Contact form email setup

The site is a static export on GitHub Pages, so there is no server and no API route.
The form on `/contact/` posts directly from the browser to **FormSubmit**
(`https://formsubmit.co/ajax/<email>`), which emails **atiehmusab@gmail.com**
(the `site.email` value in `src/data/portfolio.ts`).

## One-time activation

The first submission sends an **activation** email from FormSubmit to that inbox.
Check Inbox + Spam and click **Confirm** once. After that, messages arrive normally.

## Changing the receiving email

Edit `site.email` in `src/data/portfolio.ts`, push, then repeat the activation step for the new address.
