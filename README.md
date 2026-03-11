 # 💰 Zakat Calculator Web App

A professional web app to calculate Islamic Zakat for Muslims. Supports cash, savings, investments, digital assets, gold, and silver. All calculations run in the browser for privacy, with educational content and a contact form with optional reCAPTCHA and email delivery.  

---

## 🔹 Key Features

- 💵 **Zakat calculator** – Calculate Zakat on cash, savings, investments, digital assets, gold, and silver  
- 🌍 **Multi-currency support** – PKR, USD, EUR, GBP, SAR, AED, or custom  
- 🔒 **Privacy-first** – All calculations run in the browser, no financial data is stored on the server  
- 📚 **Educational content** – Understanding Zakat page with rules, Nisab thresholds, and hadith in English, Urdu, and Arabic  
- ✉️ **Contact form** – Send messages directly to your inbox; optional reCAPTCHA v2 for spam protection  
- 📱 **Responsive design** – Works perfectly on mobile, tablet, and desktop  
- 📝 **Extra pages** – About Us, Terms & Conditions, Privacy Policy  
- 🤖 **ZakatGPT** – In-site chatbot to ask Zakat questions and get Zakat calculated from natural language (e.g. “I have 100k cash and 50k savings, what’s my Zakat?”)  

---

## ⚙️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Hook Form, TanStack Query, Wouter, Lucide React, Shadcn/UI  
- **Backend:** Node.js + Express (handles contact form submission)  
- **Email:** Nodemailer (SMTP, e.g. Gmail)  
- **Validation:** Zod (shared schema)  

---

## 🚀 How It Works

- Users input their assets and liabilities  
- App calculates total assets, net wealth, Nisab threshold, and 2.5% Zakat amount  
- Only contact form data is sent to the server; everything else stays in the browser  
- Gold and silver can be entered in grams or tolas with user-provided rates  
- Multi-currency support lets users view amounts in their preferred currency  

---

## 📊 Zakat Calculation Logic

- **Total assets** = Cash + Savings + Investments + Digital + (Gold × rate) + (Silver × rate)  
- **Net wealth** = Total assets − Liabilities  
- **Nisab** = based on silver (52.5 tolas / 612.36 g × user’s silver rate)  
- **Zakat** = 2.5% of net wealth if ≥ Nisab  

---

## 🌐 Live Website

Below is the link to the live website (to be added later):  

[🔗 Visit https://zakat-app-wine.vercel.app/  

---

**Built for Islamic financial guidance. 🙏**

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
   - `OPENAI_API_KEY` (optional) – For ZakatGPT chatbot. Get a key at [OpenAI API keys](https://platform.openai.com/api-keys). If unset, the chat shows a friendly “not configured” message.

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

