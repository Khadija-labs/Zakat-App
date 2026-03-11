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

