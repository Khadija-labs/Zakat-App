# Zakat-App

## Deploying to Vercel

The app is set up to run on Vercel as a serverless function. All routes (API and SPA) are handled by a single handler in `api/index.ts`.

### Steps

1. **Connect the repo** to Vercel (GitHub/GitLab/Bitbucket) and import this project.

2. **Build settings** (Vercel will use these from `vercel.json`):
   - **Build Command:** `npm run build`
   - **Output:** The API function serves the app; static assets are served from `dist/public` by the same handler.

3. **Environment variables** (in Vercel → Project → Settings → Environment Variables):
   - No database is used; you don’t need `DATABASE_URL`.
   - `SMTP_USER`, `SMTP_PASS` – For the contact form (e.g. Gmail App Password).
   - `MAIL_TO` (optional) – Recipient for contact form messages.
   - `RECAPTCHA_SECRET_KEY` (optional) – If you use reCAPTCHA on the contact form.

4. **Deploy** – Push to your connected branch; Vercel will build and deploy.

### Local development

- `npm run dev` – Runs the Express server with Vite dev server (no Vercel).
- `npm run build` then `npm run start` – Production build and run locally.

---

## SEO


The app is set up for search engines and social sharing:

- **Default meta tags** in `client/index.html`: title, description, Open Graph, Twitter Card, canonical URL.
- **Per-page SEO** via the `<SEO>` component: each page sets its own title, description, and canonical URL.
- **`robots.txt`** and **`sitemap.xml`** in `client/public/` (copied to build output).
- **JSON-LD** on the home page: `WebApplication` structured data for rich results.

**Custom domain:** Set `VITE_SITE_URL` (e.g. `https://yourdomain.com`) in Vercel so meta and JSON-LD use your URL. If you don’t use `zakatcalc.app`, update the URLs in `client/public/robots.txt` and `client/public/sitemap.xml` to match your domain.

