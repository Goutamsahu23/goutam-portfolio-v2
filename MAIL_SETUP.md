# Contact form — Gmail SMTP

The contact form sends mail through a **server-side** API (`/api/contact`). SMTP credentials stay in environment variables and are never bundled into the client.

## Local setup

1. Copy the example env file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your Gmail SMTP settings:
   ```env
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your@gmail.com
   MAIL_PASS=your_16_char_app_password
   EMAIL=your@gmail.com
   ```

3. Use a [Gmail App Password](https://myaccount.google.com/apppasswords) (requires 2-Step Verification). Do **not** use your normal Gmail password.

4. Restart the dev server:
   ```bash
   npm run dev
   ```

5. Submit the contact form and check your inbox.

## Vercel (production)

In **Project → Settings → Environment Variables**, add the same five variables (`MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`, `EMAIL`) for Production (and Preview if you want). Redeploy after saving.

## Security

- Never commit `.env` or paste app passwords in chat, issues, or GitHub.
- If a password is exposed, revoke it in Google Account → Security → App passwords and create a new one.
- `MAIL_PASS` must only exist on the server (Vercel env or local `.env`), never in `VITE_*` variables.
