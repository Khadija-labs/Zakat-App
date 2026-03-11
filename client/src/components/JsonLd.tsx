import { useEffect } from "react";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://zakatcalc.app";

const webAppSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "ZakatCalc",
  description:
    "Free Zakat calculator. Calculate your Zakat accurately according to Islamic principles. Supports cash, gold, silver, savings and more. All calculations run on your device for privacy.",
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
