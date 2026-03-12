import { useEffect } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://zakat-calculators.vercel.app";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ZakatCalc – Free Zakat Calculator",
  description:
    "Free online Zakat calculator. Calculate Zakat on gold, silver, cash, savings (PKR, USD, EUR). Nisab-based, private, no data stored. Purify your wealth with precision.",
  url: SITE_URL,
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export function JsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(webAppSchema);
    script.id = "jsonld-webapp";
    const existing = document.getElementById(script.id);
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById(script.id);
      if (el) el.remove();
    };
  }, []);
  return null;
}
